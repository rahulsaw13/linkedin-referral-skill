#!/usr/bin/env bash
# Install the linkedin-referral skill, agent and slash commands into ~/.claude
# and register the Playwright MCP server with Claude Code.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
dest="${CLAUDE_HOME:-$HOME/.claude}"

mkdir -p "$dest/skills" "$dest/agents" "$dest/commands"
rm -rf "$dest/skills/linkedin-referral"
cp -r "$here/linkedin-referral" "$dest/skills/"
cp "$here/agents/linkedin-referral-agent.md" "$dest/agents/"
cp "$here"/commands/*.md "$dest/commands/"
echo "Installed skill, agent and commands into $dest"

if command -v claude >/dev/null 2>&1; then
  if claude mcp list 2>/dev/null | grep -q '^playwright'; then
    echo "Playwright MCP already registered"
  else
    claude mcp add --scope user playwright -- npx @playwright/mcp@latest && echo "Registered Playwright MCP (user scope)"
  fi
else
  echo "claude CLI not found - add the Playwright MCP yourself (see mcp/playwright.mcp.json)"
fi

mkdir -p "$HOME/job-hunt"
[ -f "$HOME/job-hunt/linkedin_profile.md" ] || cp "$here/linkedin-referral/reference/profile_template.md" "$HOME/job-hunt/linkedin_profile.md"
echo "Fill in ~/job-hunt/linkedin_profile.md, then run /linkedin-hunt in Claude Code."
