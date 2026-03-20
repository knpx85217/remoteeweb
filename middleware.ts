import { NextRequest, NextResponse } from 'next/server'
import { SecurityManager } from './lib/crypto'
import { IPWhitelist } from './lib/ip-whitelist'

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/api/dashboard', '/api/protected']
const authRoutes = ['/api/auth']
const assetsRoutes = ['/_next', '/favicon.ico']

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 200 // Increased limit to be less aggressive
  
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }
  
  if (record.count >= maxRequests) {
    return true
  }
  
  record.count++
  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  
  // Rate limiting (less aggressive)
  if (isRateLimited(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }
  
  // Allow only static assets without IP validation
  if (assetsRoutes.some(route => pathname.startsWith(route))) {
    const response = NextResponse.next()
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'no-referrer')
    return response
  }
  
  // Check IP whitelist FIRST for ALL other routes
  if (!IPWhitelist.isAuthorized(ip)) {
    const errorHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Acesso Não Autorizado</title>
</head>
<body style="font-family:Arial;padding:20px;background:#000;margin:0">
<pre style="background:#000;color:#ddd;padding:20px;border-radius:5px;margin:0">Acesso Não Autorizado - Seu IP não tem permissão para acessar este servidor

IP: ${ip}</pre>
<script>
function checkAccess() {
  fetch(window.location.href, { method: 'HEAD', credentials: 'same-origin' })
    .then(res => {
      if (res.status === 200) {
        window.location.reload();
      }
    })
    .catch(() => {});
}
setInterval(checkAccess, 2000);
checkAccess();
</script>
</body>
</html>
    `
    return new NextResponse(errorHtml, {
      status: 403,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    })
  }
  
  // Allow auth routes (after IP validation)
  if (authRoutes.some(route => pathname.startsWith(route))) {
    const response = NextResponse.next()
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'no-referrer')
    return response
  }

  // Check if route needs authentication
  const needsAuthentication = protectedRoutes.some(route => pathname.startsWith(route)) || 
                              (pathname.startsWith('/api/') && !authRoutes.some(route => pathname.startsWith(route)))
  
  if (needsAuthentication) {
    const sessionToken = request.cookies.get('pink_remote_session')?.value
    
    if (!sessionToken) {
      // No session token, return 401 for API routes, redirect for pages
      if (pathname.startsWith('/api/')) {
        return new NextResponse('Unauthorized', { status: 401 })
      }
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Validate session token
    const validation = SecurityManager.validateSessionToken(sessionToken)
    
    if (!validation.valid) {
      // Invalid session, clear cookies and return error/redirect
      const response = pathname.startsWith('/api/') 
        ? new NextResponse('Unauthorized', { status: 401 })
        : NextResponse.redirect(new URL('/', request.url))
      
      response.cookies.set('pink_remote_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/'
      })
      
      response.cookies.set('pink_remote_csrf', '', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/'
      })
      
      return response
    }
    
    // Session is valid, add security headers
    const response = NextResponse.next()
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'no-referrer')
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }
    
    return response
  }
  
  // For all other routes (like login, home page), allow with security headers
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'no-referrer')
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}