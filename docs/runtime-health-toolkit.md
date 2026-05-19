# Runtime Health Toolkit

This toolkit provides deterministic health checks for the Gemma agent runtime environment.

## Components

1. **Health Check Script** (`scripts/health-check.sh`) - Validates core runtime dependencies
2. **Verification Log** (`docs/verification-log.md`) - Records health check results

## Usage

Run the health check script to validate the runtime environment:

```bash
./scripts/health-check.sh
```

Results are automatically logged to `docs/verification-log.md`.