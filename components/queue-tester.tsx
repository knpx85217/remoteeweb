"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Clock, Play } from "lucide-react"

export function QueueTester() {
  const [commandId, setCommandId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'pending' | 'executing' | 'completed' | 'failed'>('idle')
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')

  const sendCommand = async (feature: string) => {
    setLoading(true)
    setStatus('pending')
    setError('')
    setResult('')

    try {
      // 1. Enviar comando
      const response = await fetch('/api/queue/add-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature, action: 'toggle' })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Erro ao adicionar comando')
      }

      const newCommandId = data.commandId
      setCommandId(newCommandId)

      // 2. Polling para verificar status
      let lastStatus = 'pending'
      for (let i = 0; i < 50; i++) {
        await new Promise(resolve => setTimeout(resolve, 200))

        const statusResponse = await fetch(`/api/queue/status?commandId=${newCommandId}`)
        const statusData = await statusResponse.json()

        if (statusData.success) {
          console.log('Status:', statusData.command.status)
          setStatus(statusData.command.status as any)

          if (statusData.command.status === 'completed') {
            setResult(statusData.command.result || '✅ Comando executado com sucesso!')
            setLoading(false)
            return
          }

          if (statusData.command.status === 'failed') {
            setError(statusData.command.error || 'Comando falhou')
            setLoading(false)
            return
          }

          lastStatus = statusData.command.status
        }
      }

      // Timeout
      setError('Timeout: .exe não respondeu em tempo hábil')
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
      case 'executing':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Aguardando .exe buscar comando...'
      case 'executing':
        return 'Comando sendo executado...'
      case 'completed':
        return 'Comando completado!'
      case 'failed':
        return 'Erro ao executar comando'
      default:
        return 'Pronto para enviar'
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🧪 Testador de Fila de Comandos</h2>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Clique em um comando. O site envia para a fila. O .exe (quando aberto) busca automaticamente.
          </p>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => sendCommand('rage_aim')}
              disabled={loading}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Rage Aim
            </Button>
            <Button
              onClick={() => sendCommand('legit_aim')}
              disabled={loading}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Legit Aim
            </Button>
            <Button
              onClick={() => sendCommand('esp')}
              disabled={loading}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              ESP
            </Button>
            <Button
              onClick={() => sendCommand('chams')}
              disabled={loading}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Chams
            </Button>
          </div>

          {/* Status */}
          {commandId && (
            <div className="bg-background/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="text-sm">{getStatusText()}</span>
              </div>

              <div className="text-xs text-muted-foreground break-all">
                <strong>Command ID:</strong> {commandId}
              </div>

              {result && (
                <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-green-400 text-sm">
                  ✅ {result}
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-red-400 text-sm">
                  ❌ {error}
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm text-yellow-400">
            <strong>📝 Como funciona:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Clique em um botão acima</li>
              <li>O comando é adicionado à fila</li>
              <li>Abra seu .exe em outro PC/terminal</li>
              <li>O .exe fará poll em /api/queue/next-command</li>
              <li>Quando encontrar, executará</li>
              <li>O site mostará resultado aqui</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
