# 🚀 Arquitetura de Fila de Comandos - Railway

## Resumo da Nova Arquitetura

O `.exe` **não escuta mais na porta 9999**. Agora ele:
1. ✅ Faz polling na Railway site
2. ✅ Busca próximo comando em `/api/queue/next-command`
3. ✅ Executa o comando localmente
4. ✅ Reporta resultado via `/api/queue/complete-command` ou `/api/queue/fail-command`

## Fluxo de Comunicação

```
Cliente (Site) 
  ↓ POST /api/queue/add-command (feature, action)
Site Railway (Fila em Memória)
  ↑ .exe polling
  ↓ GET /api/queue/next-command
.exe (Máquina Local)
  ↓ Executa comando
  ↓ POST /api/queue/complete-command (resultado)
Site Railway
  ↓ Client recebe resultado
```

## Componentes Atualizados

### Frontend (Next.js)
- ✅ `lib/command-queue.ts` - Gerenciador de fila (em memória)
- ✅ `lib/exe-proxy.ts` - Helpers para enviar comandos
- ✅ `/api/queue/*` - 5 endpoints para gerenciar fila
- ✅ `components/categories/aim-category.tsx` - Usa nova fila
- ✅ `components/categories/visuals-category.tsx` - Usa nova fila
- ✅ `components/server-config.tsx` - Configuração simplificada

### Backend (.exe - C++)
- ✅ `BypassHTTPServer.hpp` - Reescrito para polling

## Como Usar

### 1. No Frontend - Enviar Comando

```typescript
import { sendQueueCommand } from '@/lib/exe-proxy'

// Enviar comando
const commandId = await sendQueueCommand('rage_aim', 'activate')
```

### 2. Verificar Status

```typescript
import { getCommandStatus } from '@/lib/exe-proxy'

const status = await getCommandStatus(commandId)
// { status: 'pending' | 'executing' | 'completed' | 'failed', result?, error? }
```

### 3. Enviar e Aguardar

```typescript
import { sendAndWaitCommand } from '@/lib/exe-proxy'

const result = await sendAndWaitCommand('rage_aim', 'activate', 10000)
// Espera até 10 segundos por resposta
```

## API Endpoints

### POST /api/queue/add-command
```json
{
  "feature": "rage_aim" | "legit_aim" | "esp" | "chams" | "precision" | "headshot",
  "action": "activate" | "deactivate" | "toggle"
}
```

Response:
```json
{
  "success": true,
  "commandId": "uuid",
  "message": "Command queued"
}
```

### GET /api/queue/next-command
Chamado pelo `.exe` para buscar próximo comando

Response:
```json
{
  "success": true,
  "command": {
    "id": "uuid",
    "feature": "rage_aim",
    "action": "activate"
  },
  "pendingCount": 2
}
```

### POST /api/queue/complete-command
```json
{
  "commandId": "uuid",
  "result": "Ativado com sucesso"
}
```

### POST /api/queue/fail-command
```json
{
  "commandId": "uuid",
  "error": "Feature não encontrada"
}
```

### GET /api/queue/status?commandId=uuid
Response:
```json
{
  "success": true,
  "command": {
    "id": "uuid",
    "feature": "rage_aim",
    "action": "activate",
    "status": "completed",
    "result": "...",
    "timestamp": 1234567890
  }
}
```

## configuração do .exe - IMPORTANTE ⚠️

No `BypassHTTPServer.hpp`, mude a URL do Railway:

```cpp
std::string RAILWAY_URL = "https://seu-site.railway.app";
```

Para:
```cpp
std::string RAILWAY_URL = "https://seu-dominio-no-railway.com";
```

## Features Suportadas

- `rage_aim` - Atirador automático (full)
- `legit_aim` - Atirador automático (legit) 
- `esp` - Visualizar inimigos
- `chams` - Chams dos inimigos
- `precision` - Precisão de mira
- `headshot` - HS Pescoço

## Próximos Passos

1. **Recompile o C++** com a URL do Railway
2. **Deploy para Railway** - Seu site estará em `https://seu-dominio.railway.app`
3. **Configure .exe** com a URL correta do Railway
4. **Teste**: Clique em um botão na site → .exe executa → Vê resultado

## Troubleshooting

### ".exe não recebe comandos"
- Verificar se `RAILWAY_URL` está correto no `.exe`
- Verificar se a conexão de internet está ativa
- Checkar logs em `C:\Users\[seu-user]\Documents\BypassHTTPServer_Queue.log`

### "Comando não executa"
- Verificar os logs do `.exe`
- Confirmar que o `.exe` está rodando
- Verificar se o comando está na fila: GET `/api/protected/status`

### "Site não recebe resposta"
- Verificar latência de internet
- Aumentar timeout em `lib/exe-proxy.ts` se necessário
- Checar se `.exe` está marcando como completo

## Variáveis de Ambiente

Adicionar ao `.env.local` se precisar de gateway customizado:
```
NEXT_PUBLIC_API_URL=https://seu-dominio.railway.app
```

(Padrão: vazio = mesma URL do site)
