# FleetStartMode.ps1 - Supervisor launcher script for substack-mcp
param([switch]$Headless, [switch]$BackendOnly)

$ScriptRoot = Split-Path -Parent $PSCommandPath
$RepoRoot = Split-Path -Parent $ScriptRoot

Set-Location $RepoRoot

& "$RepoRoot\start.ps1" -Headless:$Headless -BackendOnly:$BackendOnly
