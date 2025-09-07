#!/bin/bash

# Get all Magic Patterns pages
PAGES_DIR="/users/johnshine/Dropbox/Fibonacco/goeventcity/Version2-GEC/when-the-fun/apps/web/app/components/magic-patterns/pages"
ROUTES_DIR="/users/johnshine/Dropbox/Fibonacco/goeventcity/Version2-GEC/when-the-fun/apps/web/app/routes"

echo "# Magic Patterns Integration Check Report"
echo "Generated: $(date)"
echo ""

# Count total pages
TOTAL_PAGES=$(find "$PAGES_DIR" -name "*.tsx" -type f | wc -l | tr -d ' ')
echo "Total Magic Patterns Pages: $TOTAL_PAGES"
echo ""

echo "## Checking Each Page..."
echo ""

# Process each page
find "$PAGES_DIR" -name "*.tsx" -type f | sort | while read -r page_file; do
    # Get page name
    page_name=$(basename "$page_file" .tsx)
    page_path=${page_file#$PAGES_DIR/}
    
    echo "### $page_path"
    
    # Try to find corresponding route
    # Convert page path to route path patterns
    route_guess=$(echo "$page_path" | sed 's/Page\.tsx$/\/index.tsx/g' | tr '[:upper:]' '[:lower:]')
    route_guess2=$(echo "$page_path" | sed 's/\.tsx$/\/index.tsx/g' | tr '[:upper:]' '[:lower:]')
    route_guess3=$(echo "$page_path" | sed 's/Page\.tsx$/\.tsx/g' | tr '[:upper:]' '[:lower:]')
    
    found_route=false
    
    # Search for the page import in routes
    if grep -r "import.*$page_name.*from.*magic-patterns" "$ROUTES_DIR" 2>/dev/null | head -1; then
        found_route=true
        echo "✅ Route found and uses Magic Patterns component"
    else
        echo "❌ No route found using this Magic Patterns component"
    fi
    
    echo ""
done

echo "## Summary"
echo "Total pages checked: $TOTAL_PAGES"