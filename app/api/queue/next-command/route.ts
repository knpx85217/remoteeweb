import { NextRequest, NextResponse } from 'next/server';
import { getCommandQueue } from '@/lib/command-queue';

export async function GET(request: NextRequest) {
  try {
    const queue = getCommandQueue();
    
    // Cleanup old commands
    queue.cleanup();
    
    // Get next pending command
    const command = queue.getNextCommand();

    if (!command) {
      return NextResponse.json(
        {
          success: true,
          command: null,
          pendingCount: queue.getPendingCount(),
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        command: {
          id: command.id,
          feature: command.feature,
          action: command.action,
        },
        pendingCount: queue.getPendingCount(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[next-command] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
