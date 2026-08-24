# Automated Tauri NSIS installer build script for substack-mcp
$ScriptRoot = Split-Path -Parent $PSCommandPath
$RepoRoot = Split-Path -Parent $ScriptRoot

Set-Location $RepoRoot

Write-Host "Building PyInstaller backend executable..." -ForegroundColor Cyan
uv run pyinstaller substack-mcp-backend.spec --distpath dist --clean --noconfirm

Write-Host "Building Vite webapp production dist..." -ForegroundColor Cyan
Set-Location "$RepoRoot\webapp"
npm run build

Write-Host "Building Tauri NSIS Windows Installer..." -ForegroundColor Cyan
Set-Location "$RepoRoot\src-tauri"
cargo tauri build

Write-Host "Tauri NSIS Build Complete!" -ForegroundColor Green
