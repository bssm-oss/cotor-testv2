#!/bin/bash

# Deterministic health-check script for Gemma agent runtime

LOG_FILE="docs/verification-log.md"
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")

# Initialize log file if it doesn't exist
if [ ! -f "$LOG_FILE" ]; then
  echo "# Runtime Health Verification Log" > "$LOG_FILE"
  echo "" >> "$LOG_FILE"
fi

# Append timestamp and session separator
echo "## Health Check Session: $TIMESTAMP" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Function to log check results
log_check() {
  local check_name="$1"
  local status="$2"
  local details="$3"
  echo "- **$check_name**: $status" >> "$LOG_FILE"
  if [ -n "$details" ]; then
    echo "  - Details: $details" >> "$LOG_FILE"
  fi
  echo "" >> "$LOG_FILE"
}

# Check 1: Verify README.md exists
if [ -f "README.md" ]; then
  log_check "README.md exists" "PASS" "Found at README.md"
else
  log_check "README.md exists" "FAIL" "File not found at README.md"
fi

# Check 2: Verify docs/runtime-health-toolkit.md exists
if [ -f "docs/runtime-health-toolkit.md" ]; then
  log_check "Runtime health toolkit docs exist" "PASS" "Found at docs/runtime-health-toolkit.md"
else
  log_check "Runtime health toolkit docs exist" "FAIL" "File not found at docs/runtime-health-toolkit.md"
fi

# Check 3: Verify this script exists
if [ -f "scripts/health-check.sh" ]; then
  log_check "Health check script exists" "PASS" "Found at scripts/health-check.sh"
else
  log_check "Health check script exists" "FAIL" "File not found at scripts/health-check.sh"
fi

# Check 4: Verify docs/verification-log.md exists (we're writing to it, but check if we can)
if [ -f "docs/verification-log.md" ]; then
  log_check "Verification log exists" "PASS" "Found at docs/verification-log.md"
else
  log_check "Verification log exists" "FAIL" "File not found at docs/verification-log.md"
fi

# Check 5: Check git availability
if command -v git &> /dev/null; then
  GIT_VERSION=$(git --version)
  log_check "Git available" "PASS" "$GIT_VERSION"
else
  log_check "Git available" "FAIL" "Git command not found"
fi

# Check 6: Check Python3 availability (common for agent runtimes)
if command -v python3 &> /dev/null; then
  PYTHON_VERSION=$(python3 --version)
  log_check "Python3 available" "PASS" "$PYTHON_VERSION"
else
  log_check "Python3 available" "FAIL" "Python3 command not found"
fi

# Check 7: Check current directory is a git repository
if git rev-parse --is-inside-work-tree &> /dev/null; then
  log_check "Inside git repository" "PASS" "Current directory is part of a git worktree"
else
  log_check "Inside git repository" "FAIL" "Not inside a git repository"
fi

# Add session end marker
echo "---\n" >> "$LOG_FILE"

echo "Health check complete. Results logged to $LOG_FILE"