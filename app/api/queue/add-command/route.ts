import { NextRequest, NextResponse } from 'next/server';
import { getCommandQueue } from '@/lib/command-queue';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feature, action = 'activate' } = body;

    if (!feature) {
      return NextResponse.json(
        { success: false, message: 'Feature is required' },
        { status: 400 }
      );
    }

    const queue = getCommandQueue();
    const commandId = queue.addCommand(feature, action);

    return NextResponse.json(
      {
        success: true,
        commandId,
        message: `Command queued: ${feature}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[add-command] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
