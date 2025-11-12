#!/usr/bin/env python3
"""
Test runner script for Hall Booking System
"""

import subprocess
import sys
import os

def run_tests():
    """Run pytest with proper configuration"""
    
    # Change to project root directory (where tests folder is located)
    project_root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_root)
    
    # Run pytest with specific options
    cmd = [
        sys.executable, "-m", "pytest",
        "test_app.py",
        "-v",
        "--tb=short",
        "--disable-warnings",
        # Remove -x to see all test results
    ]
    
    print("=" * 60)
    print("Running Hall Booking System Tests")
    print("=" * 60)
    print("Command:", " ".join(cmd))
    print("-" * 60)
    
    result = subprocess.run(cmd)
    
    print("-" * 60)
    if result.returncode == 0:
        print("✅ All tests passed!")
    else:
        print("❌ Some tests failed!")
    print("=" * 60)
    
    return result.returncode

if __name__ == "__main__":
    sys.exit(run_tests())