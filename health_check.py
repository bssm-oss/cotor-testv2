#!/usr/bin/env python3

import sys
import subprocess
import json
import os

def check_python_version():
    if sys.version_info < (3, 7):
        return False, f"Python version {sys.version} is less than 3.7"
    return True, f"Python version {sys.version.split()[0]} is OK"

def check_git_repo():
    try:
        subprocess.run(['git', 'rev-parse', '--is-inside-work-tree'],
                      check=True, capture_output=True, text=True)
        return True, "Inside a git repository"
    except subprocess.CalledProcessError:
        return False, "Not inside a git repository"
    except FileNotFoundError:
        return False, "git command not found"

def check_readme():
    if os.path.exists('README.md'):
        return True, "README.md exists"
    else:
        return False, "README.md does not exist"

def main():
    checks = {
        "python_version": check_python_version(),
        "git_repo": check_git_repo(),
        "readme": check_readme()
    }

    all_passed = all([check[0] for check in checks.values()])

    health_status = {
        "status": "healthy" if all_passed else "unhealthy",
        "checks": {name: {"passed": check[0], "message": check[1]} for name, check in checks.items()}
    }

    print(json.dumps(health_status, indent=2))
    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()