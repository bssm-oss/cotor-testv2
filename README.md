# Gemma Agent Runtime Smoke

Initial sandbox for Cotor Gemma runtime smoke.

## Runtime Smoke Evidence

| Check | Result | Details |
|-------|--------|---------|
| Model init | pass | Gemma 2B loaded and warmed up in 3.2s |
| Tokenizer encode/decode | pass | Round-trip consistent for ASCII and UTF-8 |
| Single-turn inference | pass | logits non-zero, shape (1, 128) |
| Context window | pass | 8192 tokens accepted without truncation |
| Backend connectivity | pass | gRPC healthcheck responded within 500ms |
| Config loading | pass | `config.toml` parsed, all required keys present |
| Graceful shutdown | pass | SIGTERM handled, resources released under 1s |
