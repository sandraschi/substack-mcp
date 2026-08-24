# Pre-commit runner for Biome webapp check
$ScriptRoot = Split-Path -Parent $PSCommandPath
$RepoRoot = Split-Path -Parent $ScriptRoot
$WebRoot = Join-Path $RepoRoot "webapp"

Set-Location $WebRoot
npx biome check .
