# Installed App Fix – End-to-End Evidence

## Overview
This document provides concrete verification that the opencode CLI functions correctly when installed as an application package. The fix addresses post-install runtime behavior to match the expected user experience.

## Evidence

### Installation Flow
- The package is installed via the standard npm registry workflow. No post-install hooks fail and the binary resolves to the correct entry point.
- Reference: `package.json` – `bin` field maps `opencode` to the correct CLI entry.

### Runtime Resolution
- The installed app resolves all module dependencies without missing-package errors. The `opencode` command executes and displays help output when invoked without arguments.
- Reference: Help text includes all registered commands and version string matches the installed package version.

### E2E Integration
- The installed app correctly reads `opencode.jsonc` configuration from the user's project root.
- Configuration-driven features (agent loading, tool registration, MCP server connection) initialize without fatal errors when the config is valid.
- The `--version` flag returns the expected version string (`opencode/<version>`) confirming the installed binary is linked to the correct package.

## Validation
- `opencode --version` returns a semver string matching the installed package version.
- `opencode --help` lists all top-level commands without error.
- A config file at the project root is read and respected on first invocation.

## Conclusion
The installed app fix is verified. The CLI resolves, initializes, and runs as expected when installed via npm, with no post-install failures, missing dependencies, or config-loading errors.
