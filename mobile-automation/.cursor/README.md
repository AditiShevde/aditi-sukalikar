# Cursor MCP (project-local)

This folder configures **MCP servers for Cursor** for the `mobile-automation/` workspace.

## What’s enabled

- **filesystem**: Read/write access limited to `${workspaceFolder}`.
- **git**: Git operations against the parent repo (`${workspaceFolder}/..`), since the `.git/` lives one level up.
- **fetch**: Fetch/read public docs pages (useful for WebdriverIO/Appium references).
- **github (optional)**: GitHub issues/PRs/etc. Requires `GITHUB_TOKEN`.
- **memory**: Lightweight scratchpad/notes for the assistant.

## Setup

1. Restart Cursor (or reload window) after adding/changing MCP config.
2. (Optional) Enable GitHub:

```bash
export GITHUB_TOKEN="..."
```

## Files

- `mcp.json`: MCP server definitions for this workspace.

