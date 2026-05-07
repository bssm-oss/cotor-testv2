# QA Release Verification Documentation

## Purpose
This document outlines the QA matrix and evidence commands required to verify a release of the Gemma Agent Runtime Smoke test.

## QA Matrix

| Feature Area          | Test Case Description                          | Pass Criteria                           | Owner       |
|-----------------------|------------------------------------------------|-----------------------------------------|-------------|
| Environment Setup     | Verify runtime dependencies are installed      | All required packages present           | QA Engineer |
| Smoke Test Execution  | Run the Gemma agent smoke test                 | Test completes without errors           | QA Engineer |
| Logging               | Check that logs are generated correctly        | Log files contain expected entries      | QA Engineer |
| Resource Cleanup      | Verify no lingering processes after test       | All test-related processes terminated   | QA Engineer |
| Artifact Generation   | Confirm test artifacts are produced            | Expected output files exist             | QA Engineer |

## Evidence Commands

### 1. Environment Verification
```bash
# Check Python version
python3 --version

# List installed packages
pip list | grep -E "gemma|torch|transformers"

# Verify GPU availability (if applicable)
nvidia-smi
```

### 2. Smoke Test Execution
```bash
# Run the smoke test
python3 -m pytest tests/smoke_test_gemma.py -v

# Alternative: run the main script
python3 run_gemma_smoke.py
```

### 3. Logging Verification
```bash
# Check log file existence and content
ls -la logs/
grep -i "error\|warn\|info" logs/gemma_smoke_*.log | head -20
```

### 4. Resource Cleanup Check
```bash
# Check for remaining Python processes
ps aux | grep -E "gemma|python" | grep -v grep

# Check for lingering temporary files
ls -la /tmp/ | grep gemma
```

### 5. Artifact Verification
```bash
# List generated artifacts
ls -la artifacts/
# Check specific expected files
test -f artifacts/gemma_output.json && echo "Output file exists" || echo "Missing output file"
```

## Verification Summary
After running the above commands, QA should confirm:
- All smoke tests pass with exit code 0
- No error messages in logs
- Expected artifacts are generated
- System returns to clean state after test execution

## Notes
- This verification is designed for the Gemma Agent Runtime Smoke test environment.
- Adjust paths and commands as needed for specific deployment environments.
- For production releases, extend this matrix with integration and performance tests.