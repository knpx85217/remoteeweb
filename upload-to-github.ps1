#!/usr/bin/env pwsh

# 🚀 GitHub Upload Script for remoteweb
# Execute este script para fazer upload para o GitHub

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║ 📤 Pink Remote - GitHub Upload                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar se está no diretório correto
$gitDir = Get-Location
$gitConfigPath = Join-Path $gitDir ".git"

if (-not (Test-Path $gitConfigPath)) {
    Write-Host "❌ Erro: Não está no diretório do git!" -ForegroundColor Red
    Write-Host "Execute este script em: c:\Users\gusta9s\Downloads\gusta9 ff (1)\gusta9 ff\remotewebhttps"
    exit 1
}

Write-Host "✅ Repositório git encontrado" -ForegroundColor Green
Write-Host ""

# Pedir username do GitHub
$username = Read-Host "Digite seu username do GitHub"
if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "❌ Username é obrigatório!" -ForegroundColor Red
    exit 1
}

$repoUrl = "https://github.com/$username/remoteweb.git"

Write-Host ""
Write-Host "📋 Configuração:" -ForegroundColor Yellow
Write-Host "  Usuário: $username"
Write-Host "  Repositório: $repoUrl"
Write-Host ""

# Confirmar
$confirm = Read-Host "Deseja continuar? (s/n)"
if ($confirm -ne 's') {
    Write-Host "Cancelado" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "⏳ Configurando git..." -ForegroundColor Cyan

# Remover remote antigo se existir
git remote remove origin 2>$null

# Adicionar novo remote
git remote add origin $repoUrl
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao adicionar remote!" -ForegroundColor Red
    exit 1
}

# Renomear branch
git branch -M main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao renomear branch!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git configurado" -ForegroundColor Green
Write-Host ""

Write-Host "⏳ Fazendo push para GitHub..." -ForegroundColor Cyan
Write-Host "(Se pedir login, use seu Email + Personal Access Token)" -ForegroundColor Yellow
Write-Host ""

# Fazer push
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║ ✅ Upload concluído com sucesso!                       ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 Seu repositório: https://github.com/$username/remoteweb" -ForegroundColor Green
    Write-Host ""
    Write-Host "📚 Próximos passos:"
    Write-Host "  1. Acesse https://railway.app"
    Write-Host "  2. Clique 'New Project' → 'Deploy from GitHub'"
    Write-Host "  3. Selecione o repositório 'remoteweb'"
    Write-Host "  4. Railway faz deploy automático!"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erro ao fazer push!" -ForegroundColor Red
    Write-Host "Verifique:"
    Write-Host "  1. Se o repositório 'remoteweb' foi criado no GitHub"
    Write-Host "  2. Se você passou o username correto"
    Write-Host "  3. Sua internet está funcionando"
    Write-Host ""
    exit 1
}
