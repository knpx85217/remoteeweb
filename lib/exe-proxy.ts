/**
 * Helper para interagir com o sistema de fila de comandos
 * Simplifica o envio de comandos para o .exe através da Railway
 */

import { CommandFeature } from './command-queue';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export interface QueueResponse {
  success: boolean;
  message?: string;
  commandId?: string;
  command?: any;
  error?: string;
}

/**
 * Enviar comando para a fila
 * @param feature Recurso a ser ativado (rage_aim, legit_aim, esp, etc)
 * @param action Ação: activate, deactivate, toggle
 * @returns ID do comando na fila
 */
export async function sendQueueCommand(
  feature: CommandFeature,
  action: 'activate' | 'deactivate' | 'toggle' = 'activate'
): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE}/api/queue/add-command`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feature, action }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.commandId) {
      return data.commandId;
    }

    return null;
  } catch (error) {
    console.error('[sendQueueCommand] Error:', error);
    return null;
  }
}

/**
 * Verificar status de um comando
 * @param commandId ID do comando
 * @returns Status e informações do comando
 */
export async function getCommandStatus(commandId: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/api/queue/status?commandId=${commandId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.command || null;
  } catch (error) {
    console.error('[getCommandStatus] Error:', error);
    return null;
  }
}

/**
 * Enviar comando e aguardar com polling
 * @param feature Recurso a ser ativado
 * @param action Ação
 * @param maxWaitMs Tempo máximo de espera (padrão 10 segundos)
 * @returns Status final do comando
 */
export async function sendAndWaitCommand(
  feature: CommandFeature,
  action: 'activate' | 'deactivate' | 'toggle' = 'activate',
  maxWaitMs = 10000
): Promise<any> {
  const commandId = await sendQueueCommand(feature, action);
  if (!commandId) return null;

  const startTime = Date.now();
  const pollInterval = 500; // Poll a cada 500ms

  while (Date.now() - startTime < maxWaitMs) {
    const status = await getCommandStatus(commandId);

    if (status) {
      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  // Timeout - retornar status atual
  return await getCommandStatus(commandId);
}
