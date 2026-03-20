import { NextRequest, NextResponse } from 'next/server';
import { getCommandQueue } from '@/lib/command-queue';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const commandId = searchParams.get('commandId');

    if (!commandId) {
      return NextResponse.json(
        { success: false, message: 'commandId query parameter is required' },
        { status: 400 }
      );
    }

    const queue = getCommandQueue();
    const command = queue.getCommand(commandId);

    if (!command) {
      return NextResponse.json(
        { success: false, message: `Command not found: ${commandId}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        command,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[status] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
