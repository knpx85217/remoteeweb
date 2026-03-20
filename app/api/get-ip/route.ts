import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  
  return NextResponse.json({
    ip: ip,
    message: 'Este é o seu IP atual. Copie e adicione em authorized-ips.ts se desejar autorizar este acesso.'
  })
}
