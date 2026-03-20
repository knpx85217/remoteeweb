import { NextRequest, NextResponse } from 'next/server'

/**
 * ⚠️ DEPRECATED - Esta API foi substituída pelo sistema de fila
 * 
 * A nova arquitetura usa:
 * POST /api/queue/add-command - Cliente envia comando
 * GET /api/queue/next-command - .exe busca próximo comando
 * POST /api/queue/complete-command - .exe marca como completo
 * POST /api/queue/fail-command - .exe marca como falho
 * GET /api/queue/status - Verifica status de um comando
 * 
 * Use sendQueueCommand() do lib/exe-proxy.ts!
 */

export async function GET(request: NextRequest) {
  return NextResponse.json({
    deprecated: true,
    message: 'Use /api/queue/* endpoints instead',
    reason: 'New queue-based architecture for Railway'
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    deprecated: true,
    message: 'Use /api/queue/* endpoints instead',
    reason: 'New queue-based architecture for Railway'
  })
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({
    deprecated: true,
    message: 'Use /api/queue/* endpoints instead',
    reason: 'New queue-based architecture for Railway'
  })
}
