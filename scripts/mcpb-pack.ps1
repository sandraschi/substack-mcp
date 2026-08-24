# mcpb-pack.ps1 — Bundle .mcpb desktop package
$ScriptRoot = Split-Path -Parent $PSCommandPath
$RepoRoot = Split-Path -Parent $ScriptRoot
$DistDir = Join-Path $RepoRoot "dist"
$McpbDir = Join-Path $RepoRoot "mcpb"

if (-not (Test-Path $DistDir)) { New-Item -ItemType Directory -Path $DistDir -Force | Out-Null }

$TempZip = Join-Path $DistDir "substack-mcp.zip"
$McpbPath = Join-Path $DistDir "substack-mcp.mcpb"

if (Test-Path $TempZip) { Remove-Item $TempZip -Force }
if (Test-Path $McpbPath) { Remove-Item $McpbPath -Force }

Compress-Archive -Path "$McpbDir\*" -DestinationPath $TempZip -Force
Move-Item -Path $TempZip -Destination $McpbPath -Force

Write-Host "Created .mcpb package at: $McpbPath" -ForegroundColor Green
