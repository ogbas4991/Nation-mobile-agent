# PAPYLO J AGENT

> A mobile-first AI workspace for building, automating, and working with local intelligence.

PAPYLO J AGENT turns an Android phone into an AI workstation. It combines chat, on-device models, persistent memory, files, MCP tools, skills, scheduled work, and direct device access in one interface.

## Product direction

The new interface is organized around **tasks**, not a generic chat list:

- **Agent** — run multi-step AI tasks with Build or Plan modes.
- **Library** — keep reusable prompts, skills, and knowledge in one place.
- **Files & memory** — work with phone files and persistent agent context.
- **Automations** — schedule recurring agent work and background runs.
- **Local-first runtime** — prefer on-device/local providers when configured.
- **MCP + skills** — connect tools and extend what the agent can do.
- **Human approval** — pause sensitive actions for confirmation.

## Design system

The redesigned mobile shell uses a compact workspace sidebar, task-oriented navigation, clear runtime status, stronger visual hierarchy, and a focused composer. The goal is to make the app feel like a serious mobile development/automation workstation rather than a clone of a conventional chat app.

## Core capabilities

- On-device AI models
- Local and remote AI provider support
- MCP server integration
- Skills system
- Persistent SQLite-backed memory
- Multi-step agent execution
- Build and Plan modes
- File and workspace access
- Scheduled/background agent runs
- Notifications and run status
- Conversation pinning, rename, and deletion
- Multi-modal attachments

## Development

```bash
pnpm install
pnpm start
```

Android development:

```bash
pnpm android
```

Quality checks:

```bash
pnpm lint
pnpm test
```

## Branding

- Product: **PAPYLO J AGENT**
- Package slug: `papylo-j-agent`
- Android application ID: `com.papylo.jagent`

## License

MIT
