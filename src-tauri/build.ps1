# Automated Tauri NSIS installer build script for substack-mcp
$ScriptRoot = Split-Path -Parent $PSCommandPath
$RepoRoot = Split-Path -Parent $ScriptRoot

Set-Location $RepoRoot

Write-Host "Building PyInstaller backend executable..." -ForegroundColor Cyan
# PyInstaller MUST run from the project venv, not `uv run pyinstaller` --
# that resolves to the isolated global uv-tool environment (no project
# packages visible there), so copy_metadata("fastmcp") in the spec file
# silently fails and the frozen exe crashes with PackageNotFoundError at
# import time. See TAURI_PRODUCTION_PITFALLS.md sec 13 #12-13.
$pyiExe = "$RepoRoot\.venv\Scripts\pyinstaller.exe"
if (-not (Test-Path $pyiExe)) {
    Write-Host "  pyinstaller missing from project venv - adding as dev dependency" -ForegroundColor Yellow
    uv add --dev pyinstaller pefile altgraph
    uv sync
}
Remove-Item "$RepoRoot\dist\substack-mcp-backend.exe" -Force -ErrorAction SilentlyContinue
& $pyiExe substack-mcp-backend.spec --distpath dist --clean --noconfirm

Write-Host "Building Vite webapp production dist..." -ForegroundColor Cyan
Set-Location "$RepoRoot\webapp"
npm run build

Write-Host "Building Tauri NSIS Windows Installer..." -ForegroundColor Cyan
Set-Location "$RepoRoot\src-tauri"
cargo tauri build

Write-Host "Tauri NSIS Build Complete!" -ForegroundColor Green
