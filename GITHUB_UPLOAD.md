# 📤 GitHub Upload Script

## Instruções:

### 1️⃣ Criar Repositório no GitHub
- Acesse: https://github.com/new
- **Nome**: `remoteweb`
- **Descrição**: Pink Remote - Game Bypass for Railway
- **Privacidade**: Pública ou Privada (sua preferência)
- **Não** marque "Initialize this repository with:"
- Clique **"Create repository"**

### 2️⃣ Execute este comando no PowerShell

Substitua `SEU_USUARIO` pelo seu user do GitHub:

```powershell
cd "c:\Users\gusta9s\Downloads\gusta9 ff (1)\gusta9 ff\remotewebhttps"

git remote add origin https://github.com/SEU_USUARIO/remoteweb.git
git branch -M main
git push -u origin main
```

**Exemplo:**
```powershell
git remote add origin https://github.com/gusta9s/remoteweb.git
git branch -M main
git push -u origin main
```

### 3️⃣ Autenticação

Se pedir **username/password**:
- **Username**: seu email do GitHub
- **Password**: Token (não senha!)

Para gerar token:
1. Acesse: https://github.com/settings/tokens
2. Clique "Generate new token (classic)"
3. Selecione escopos: `repo`, `write:packages`
4. Copie e cole no prompt do PowerShell

### 4️⃣ Verificar Upload

No GitHub, você verá:
- 66 files uploaded
- 2 commits (Initial + Railway guide)
- Todos os arquivos do projeto

---

**Seu repositório estará em**: https://github.com/SEU_USUARIO/remoteweb
