import { NextRequest, NextResponse } from 'next/server';
import { getCommandQueue } from '@/lib/command-queue';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { commandId, result } = body;

    if (!commandId) {
      return NextResponse.json(
        { success: false, message: 'commandId is required' },
        { status: 400 }
      );
    }

    const queue = getCommandQueue();
    const success = queue.completeCommand(commandId, result);

    if (!success) {
      return NextResponse.json(
        { success: false, message: `Command not found: ${commandId}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Command completed',
        commandId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[complete-command] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
