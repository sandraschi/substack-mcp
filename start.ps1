param([switch]$Headless, [switch]$BackendOnly, [switch]$NoBrowser)
$ErrorActionPreference = "Stop"
$ScriptRoot = Split-Path -Parent $PSCommandPath
$BackendPort = 11163
$FrontendPort = 11164

$Host.UI.RawUI.WindowTitle = "substack-mcp - backend :$BackendPort / frontend :$FrontendPort"
if (-not $Headless) {
    Write-Host ""
    Write-Host "  substack-mcp" -ForegroundColor Cyan
    Write-Host "  BACKEND   http://127.0.0.1:$BackendPort   (REST /api, MCP /mcp)" -ForegroundColor Gray
    Write-Host "  FRONTEND  http://127.0.0.1:$FrontendPort  (webapp UI)" -ForegroundColor Gray
    Write-Host ""
}

# Clear port zombies
Get-NetTCPConnection -LocalPort $BackendPort -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Get-NetTCPConnection -LocalPort $FrontendPort -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

# Ensure data dir exists
$DataDir = Join-Path $ScriptRoot "data"
if (-not (Test-Path $DataDir)) { New-Item -ItemType Directory -Path $DataDir -Force | Out-Null }

# Start backend job
$BackendJob = Start-Job -Name "substack-backend" -ScriptBlock {
    param($Root, $Port)
    Set-Location $Root
    uv run python -m substack_mcp.server --port $Port
} -ArgumentList $ScriptRoot, $BackendPort

# Poll for backend readiness
for ($i = 0; $i -lt 30; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://127.0.0.1:$BackendPort/health" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($r.StatusCode -eq 200) { break }
    } catch {}
    Start-Sleep 1
}

if ($BackendOnly) {
    Write-Host "Backend started on port $BackendPort." -ForegroundColor Green
    Receive-Job $BackendJob
    exit
}

# Start webapp frontend
$WebRoot = Join-Path $ScriptRoot "webapp"
if (Test-Path $WebRoot) {
    Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c npm run dev -- --port $FrontendPort --host" -WorkingDirectory $WebRoot
}

if (-not $NoBrowser) {
    Start-Sleep 2
    Start-Process "http://127.0.0.1:$FrontendPort"
}

# Keep-alive monitoring loop
while ($true) {
    if ($BackendJob.State -eq "Completed" -or $BackendJob.State -eq "Failed") {
        Receive-Job $BackendJob
        break
    }
    Start-Sleep 2
}
