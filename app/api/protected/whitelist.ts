import { NextRequest, NextResponse } from 'next/server'
import { IPWhitelist } from '@/lib/ip-whitelist'
import { SecurityManager } from '@/lib/crypto'

export async function GET(request: NextRequest) {
  try {
    // Validar autenticação
    const sessionToken = request.cookies.get('pink_remote_session')?.value
    if (!sessionToken || !SecurityManager.validateSessionToken(sessionToken).valid) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Retornar lista de IPs autorizados
    const whitelist = IPWhitelist.getWhitelist()
    
    return NextResponse.json({
      success: true,
      whitelist,
      count: whitelist.length
    })
  } catch (error) {
    console.error('Error getting IP whitelist:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validar autenticação
    const sessionToken = request.cookies.get('pink_remote_session')?.value
    if (!sessionToken || !SecurityManager.validateSessionToken(sessionToken).valid) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { action, ip } = body

    if (!action || !ip) {
      return NextResponse.json(
        { success: false, error: 'Missing action or ip parameter' },
        { status: 400 }
      )
    }

    if (action === 'add') {
      IPWhitelist.addIP(ip)
      return NextResponse.json({
        success: true,
        message: `IP ${ip} adicionado à whitelist`,
        whitelist: IPWhitelist.getWhitelist()
      })
    } else if (action === 'remove') {
      IPWhitelist.removeIP(ip)
      return NextResponse.json({
        success: true,
        message: `IP ${ip} removido da whitelist`,
        whitelist: IPWhitelist.getWhitelist()
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Use "add" or "remove"' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error managing IP whitelist:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
