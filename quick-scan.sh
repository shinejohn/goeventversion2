#!/bin/bash

# Quick Quality Scan Script
# Run targeted scans for specific issues

echo "🔍 Quick Quality Scanner for When's The Fun"
echo "=========================================="

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# 1. React Router v6 vs v7 Issues
echo -e "\n${YELLOW}1. React Router Version Issues:${NC}"
echo "Checking for react-router-dom imports (should be react-router)..."
rg "from ['\"]react-router-dom['\"]" --type tsx --type ts -c || echo "✅ No react-router-dom imports found"

echo -e "\nChecking for Routes/Route components (v6 pattern)..."
rg "<Routes>|<Route " --type tsx --type ts -c || echo "✅ No v6 Routes components found"

# 2. Hardcoded Mock Data
echo -e "\n${YELLOW}2. Hardcoded Mock Data Issues:${NC}"
echo "Checking for hardcoded 'Clearwater Jazz Holiday'..."
rg "Clearwater Jazz Holiday" --type tsx --type ts -n | head -10

echo -e "\nChecking for hardcoded Unsplash URLs..."
rg "https://images\.unsplash\.com" --type tsx --type ts -c

# 3. Navigation Issues
echo -e "\n${YELLOW}3. Navigation Route Issues:${NC}"
echo "Checking for old auth routes (/login, /signup)..."
rg "/(login|signup)" --type tsx --type ts -n | grep -v "sign-in\|sign-up" | head -10

# 4. Mock Data Arrays
echo -e "\n${YELLOW}4. Mock Data Array Usage:${NC}"
echo "Checking for hardcoded array indices [0]..."
rg "mock(Events|Performers|Venues)\[0\]" --type tsx --type ts -n | head -10

# 5. Missing Dynamic IDs
echo -e "\n${YELLOW}5. Hardcoded IDs:${NC}"
echo "Checking for hardcoded IDs (event-1, performer-1, etc)..."
rg "(event|performer|venue)-1['\"]" --type tsx --type ts -n | head -10

echo -e "\n${GREEN}Scan Complete!${NC}"
echo "For detailed analysis, run: node code-quality-scanner.js"