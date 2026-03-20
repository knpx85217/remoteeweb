import { v4 as uuidv4 } from 'uuid';

export type CommandStatus = 'pending' | 'executing' | 'completed' | 'failed';
export type CommandFeature = 'rage_aim' | 'legit_aim' | 'esp' | 'chams' | 'precision' | 'headshot';

export interface Command {
  id: string;
  feature: CommandFeature;
  action?: 'activate' | 'deactivate' | 'toggle';
  status: CommandStatus;
  timestamp: number;
  result?: string;
  error?: string;
}

class CommandQueue {
  private commands: Map<string, Command> = new Map();
  private commandQueue: string[] = []; // IDs in order
  private readonly MAX_AGE = 5 * 60 * 1000; // 5 minutes

  addCommand(feature: CommandFeature, action: 'activate' | 'deactivate' | 'toggle' = 'activate'): string {
    const id = uuidv4();
    const command: Command = {
      id,
      feature,
      action,
      status: 'pending',
      timestamp: Date.now(),
    };

    this.commands.set(id, command);
    this.commandQueue.push(id);

    console.log('[CommandQueue] Command added:', id, feature);
    return id;
  }

  getNextCommand(): Command | null {
    this.cleanup();

    // Find first pending command
    for (const id of this.commandQueue) {
      const cmd = this.commands.get(id);
      if (cmd && cmd.status === 'pending') {
        // Mark as executing
        cmd.status = 'executing';
        console.log('[CommandQueue] Command executing:', id);
        return { ...cmd };
      }
    }

    return null;
  }

  completeCommand(commandId: string, result?: string): boolean {
    const command = this.commands.get(commandId);
    if (!command) return false;

    command.status = 'completed';
    if (result) command.result = result;
    command.timestamp = Date.now(); // Update timestamp for cleanup

    console.log('[CommandQueue] Command completed:', commandId);
    return true;
  }

  failCommand(commandId: string, error: string): boolean {
    const command = this.commands.get(commandId);
    if (!command) return false;

    command.status = 'failed';
    command.error = error;
    command.timestamp = Date.now();

    console.log('[CommandQueue] Command failed:', commandId, error);
    return true;
  }

  getCommand(commandId: string): Command | null {
    return this.commands.get(commandId) || null;
  }

  getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  getPendingCount(): number {
    return Array.from(this.commands.values()).filter(cmd => cmd.status === 'pending').length;
  }

  cleanup(): number {
    const now = Date.now();
    let removed = 0;

    for (const [id, command] of this.commands.entries()) {
      // Remove completed/failed commands older than MAX_AGE
      if ((command.status === 'completed' || command.status === 'failed') &&
          now - command.timestamp > this.MAX_AGE) {
        this.commands.delete(id);
        // Remove from queue array
        const idx = this.commandQueue.indexOf(id);
        if (idx >= 0) this.commandQueue.splice(idx, 1);
        removed++;
      }
    }

    if (removed > 0) {
      console.log('[CommandQueue] Cleanup removed:', removed, 'old commands');
    }

    return removed;
  }

  clear(): void {
    this.commands.clear();
    this.commandQueue = [];
    console.log('[CommandQueue] All commands cleared');
  }
}

// Global singleton
let queueInstance: CommandQueue | null = null;

export function getCommandQueue(): CommandQueue {
  if (!queueInstance) {
    queueInstance = new CommandQueue();
  }
  return queueInstance;
}
