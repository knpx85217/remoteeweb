import { NextRequest, NextResponse } from 'next/server'
import { getCommandQueue } from '@/lib/command-queue'

/**
 * Health check endpoint
 * Retorna status da fila de comandos
 */
export async function GET(request: NextRequest) {
  try {
    const queue = getCommandQueue()
    const pendingCount = queue.getPendingCount()
    const commands = queue.getAllCommands()

    return NextResponse.json({ 
      status: 'online',
      message: 'Sistema de fila operacional',
      queue: {
        pendingCount,
        totalCommands: commands.length
      }
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      message: 'Erro ao verificar status da fila'
    }, { status: 500 })
  }
}
