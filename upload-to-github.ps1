#!/usr/bin/env pwsh
# encoding: utf-8

# GitHub Upload Script for remoteweb

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "GitHub Upload - remoteweb" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Check if we are in the correct directory
$gitDir = Get-Location
$gitConfigPath = Join-Path $gitDir ".git"

if (-not (Test-Path $gitConfigPath)) {
    Write-Host "ERROR: Not in a git directory!" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Git repository found" -ForegroundColor Green
Write-Host ""

# Ask for GitHub username
$username = Read-Host "Enter your GitHub username"
if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "ERROR: Username is required!" -ForegroundColor Red
    exit 1
}

$repoUrl = "https://github.com/$username/remoteweb.git"

Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Username: $username"
Write-Host "  Repository: $repoUrl"
Write-Host ""

# Confirm
$confirm = Read-Host "Continue? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "Cancelled" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Configuring git..." -ForegroundColor Cyan

# Remove old remote if exists
git remote remove origin 2>$null

# Add new remote
git remote add origin $repoUrl
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Could not add remote!" -ForegroundColor Red
    exit 1
}

# Rename branch
git branch -M main
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Could not rename branch!" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Git configured" -ForegroundColor Green
Write-Host ""

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "(If asked for login, use Email + Personal Access Token)" -ForegroundColor Yellow
Write-Host ""

# Push
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "====================================================" -ForegroundColor Green
    Write-Host "[OK] Upload completed successfully!" -ForegroundColor Green
    Write-Host "====================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your repository: https://github.com/$username/remoteweb" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps for Railway deployment:"
    Write-Host "  1. Go to https://railway.app"
    Write-Host "  2. Click 'New Project' -> 'Deploy from GitHub'"
    Write-Host "  3. Select 'remoteweb' repository"
    Write-Host "  4. Railway will deploy automatically!"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERROR: Could not push!" -ForegroundColor Red
    Write-Host "Check:"
    Write-Host "  1. If you created 'remoteweb' repository on GitHub"
    Write-Host "  2. If you entered the correct username"
    Write-Host "  3. If your internet connection is working"
    Write-Host ""
    exit 1
}
