#!/usr/bin/env bash
# Plain bash script to validate the repository state
# Does not use network, package managers, paid providers, codex, deepseek, gemma4, or non-opencode pro

echo "Validating repository state..."

# Check if we are in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "Error: Not a git repository"
  exit 1
fi

# Check current branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $current_branch"

# Check if there are any uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "Warning: Working directory has uncommitted changes"
else
  echo "Working directory clean"
fi

# Check if we are up to date with origin/main (if origin exists)
if git remote | grep -q origin; then
  # Fetch to get latest status (but note: we are not allowed to use network? 
  # However, the prohibition might be for the script we are writing to not use network in its operation.
  # But git fetch uses network. We must avoid network usage.
  # So we skip the fetch and just check the last commit status from local refs.
  echo "Skipping network check for origin/main to avoid network usage"
else
  echo "No origin remote configured"
fi

echo "Validation complete"
exit 0