# Pink Remote - Railway Deployment Guide

## 🚀 Configuração Rápida

Este é um projeto Next.js 14 configurado para funcionar com Railway, usando um sistema de fila de comandos para comunicar com o `.exe` rodando localmente.

## 📋 Pré-requisitos

- [GitHub Account](https://github.com) - Para hospedar o código
- [Railway Account](https://railway.app) - Para fazer deploy
- Node.js 18+ - Para desenvolvimento local

## 🔧 Setup Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Acessar em http://localhost:3000
```

## 📦 Deploy no Railway

### Passo 1: Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Nome: `pink-remote` (ou o nome que preferir)
3. Descrição: "Pink Remote - Game Bypass for Railway"
4. Escolha se privado ou público
5. **NÃO** inicialize com README (já existe)
6. Clique em "Create repository"

### Passo 2: Fazer Push para GitHub

Copie e execute no PowerShell:

```powershell
cd "c:\Users\gusta9s\Downloads\gusta9 ff (1)\gusta9 ff\remotewebhttps"

# Configurar remote (substitua SEU_USUARIO e SEU_REPO)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git branch -M main
git push -u origin main
```

**Exemplo**:
```powershell
git remote add origin https://github.com/johndoe/pink-remote.git
git branch -M main
git push -u origin main
```

### Passo 3: Deploy no Railway

1. Acesse https://railway.app
2. Clique em "New Project"
3. Selecione "Deploy from GitHub"
4. Autorize GitHub
5. Selecione o repositório `pink-remote`
6. Railway detectará automaticamente como Next.js
7. Clique em "Deploy"

### Passo 4: Configurar Variáveis de Ambiente

No painel do Railway:
1. Vá até a aba "Variables"
2. Adicione as variáveis (copie de `.env.local`):

```
AUTH_SECRET=9889c74d24d40ee828d57e1bf205e594...
JWT_SECRET=7febc3b4db5f549556c5c324963ab9f...
ENCRYPTION_KEY=cec6c9c9a7bd4e1e28c422c470c076d...
SESSION_SECRET=3514946e9f99886bca21dcbde9b930268...
VALID_DISCORD_ID=1247285760558633145
NODE_ENV=production
SECURE_COOKIES=true
```

### Passo 5: Obter URL do Railway

1. Vá até "Settings" → "Domains"
2. Copie a URL pública (ex: `https://pink-remote-production.up.railway.app`)
3. **Essa é sua URL do Railway!** ⭐

## 🎯 Configurar .exe

No `BypassHTTPServer.hpp`, mude:

```cpp
std::string RAILWAY_URL = "https://seu-site.railway.app";
```

Para sua URL real:

```cpp
std::string RAILWAY_URL = "https://pink-remote-production.up.railway.app";
```

Recompile o C++ e teste!

## 📊 Arquitetura

```
Cliente (Site Railway)
    ↓ POST /api/queue/add-command
    ↓
Fila de Comandos (Memória no Railway)
    ↑ GET /api/queue/next-command
    ↓
.exe (Sua Máquina Local)
    ↓ Executa Comando
    ↓ POST /api/queue/complete-command
    ↑
Site Railway (Exibe Resultado)
```

## 📚 Endpoints de Fila

- `POST /api/queue/add-command` - Enviar comando
- `GET /api/queue/next-command` - .exe busca comando
- `POST /api/queue/complete-command` - .exe marca completo
- `POST /api/queue/fail-command` - .exe marca erro
- `GET /api/queue/status` - Verificar status

Veja [QUEUE_ARCHITECTURE.md](./QUEUE_ARCHITECTURE.md) para detalhes.

## 🔒 Segurança

- ✅ `.env.local` ignorado no git (nunca vai para GitHub)
- ✅ Autenticação por JWT
- ✅ Rate limiting ativo
- ✅ CORS configurado
- ✅ CSP headers ativo

## 🐛 Troubleshooting

### Erro ao fazer push:
```
fatal: could not read Username for 'https://github.com'
```
**Solução**: Use token ao invés de senha no GitHub (Settings → Developer settings → Personal access tokens)

### Erro "EADDRINUSE" em localhost:
```bash
# Mudar porta
npm run dev -- -p 3001
```

### .exe não recebe comandos:
1. Verificar se a URL está correta em `BypassHTTPServer.hpp`
2. Verificar logs em `C:\Users\[seu-user]\Documents\BypassHTTPServer_Queue.log`
3. Confirmar internet está funcionando

## 📝 Próximos Passos

1. ✅ Push para GitHub (siga Passo 2)
2. ✅ Deploy no Railway (siga Passo 3-4)
3. ✅ Obter URL (siga Passo 5)
4. ✅ Configurar .exe com URL
5. ✅ Testar: Clique botão → .exe executa → Ver resultado

## 🔗 Links Úteis

- [Railway Docs](https://docs.railway.app)
- [Next.js Docs](https://nextjs.org/docs)
- [GitHub SSH Setup](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Personal Access Token](https://github.com/settings/tokens)

## 📞 Problemas?

Verificar:
1. GitHub connection
2. Railway logs (Deployments tab)
3. .exe logs em `Documents\BypassHTTPServer_Queue.log`
4. URL está correta em ambos os lados

---

**Status**: ✅ Pronto para Railway | 🔧 .exe Configurado | 📡 Sistemas de Fila Ativos
