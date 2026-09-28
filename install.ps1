# Install the linkedin-referral skill, agent and slash commands into ~/.claude
# and register the Playwright MCP server with Claude Code (Windows PowerShell).
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$dest = if ($env:CLAUDE_HOME) { $env:CLAUDE_HOME } else { Join-Path $HOME '.claude' }

foreach ($d in 'skills', 'agents', 'commands') { New-Item -ItemType Directory -Force (Join-Path $dest $d) | Out-Null }
$skill = Join-Path $dest 'skills\linkedin-referral'
if (Test-Path $skill) { Remove-Item -Recurse -Force $skill }
Copy-Item -Recurse (Join-Path $here 'linkedin-referral') (Join-Path $dest 'skills')
Copy-Item (Join-Path $here 'agents\linkedin-referral-agent.md') (Join-Path $dest 'agents')
Copy-Item (Join-Path $here 'commands\*.md') (Join-Path $dest 'commands')
Write-Output "Installed skill, agent and commands into $dest"

if (Get-Command claude -ErrorAction SilentlyContinue) {
    $list = (claude mcp list 2>$null) -join "`n"
    if ($list -match '(?m)^playwright') { Write-Output 'Playwright MCP already registered' }
    else { claude mcp add --scope user playwright -- npx '@playwright/mcp@latest'; Write-Output 'Registered Playwright MCP (user scope)' }
} else {
    Write-Output 'claude CLI not found - add the Playwright MCP yourself (see mcp\playwright.mcp.json)'
}

$hunt = Join-Path $HOME 'job-hunt'
New-Item -ItemType Directory -Force $hunt | Out-Null
$prefs = Join-Path $hunt 'linkedin_profile.md'
if (-not (Test-Path $prefs)) { Copy-Item (Join-Path $here 'linkedin-referral\reference\profile_template.md') $prefs }
Write-Output "Fill in $prefs, then run /linkedin-hunt in Claude Code."
