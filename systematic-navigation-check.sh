#!/bin/bash

PAGES_DIR="/users/johnshine/Dropbox/Fibonacco/goeventcity/Version2-GEC/when-the-fun/apps/web/app/components/magic-patterns/pages"
ROUTES_DIR="/users/johnshine/Dropbox/Fibonacco/goeventcity/Version2-GEC/when-the-fun/apps/web/app/routes"
LOG_FILE="/users/johnshine/Dropbox/Fibonacco/goeventcity/Version2-GEC/when-the-fun/SYSTEMATIC-CHECK-LOG.md"

echo "# Systematic Navigation Check Log" > "$LOG_FILE"
echo "Generated: $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Get all pages
PAGES=$(find "$PAGES_DIR" -name "*.tsx" -type f | sort)
TOTAL=$(echo "$PAGES" | wc -l | tr -d ' ')

echo "Total Pages: $TOTAL" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

COUNT=1

# Process each page
while IFS= read -r page_file; do
    page_name=$(basename "$page_file" .tsx)
    page_path=${page_file#$PAGES_DIR/}
    
    echo "## Page $COUNT/$TOTAL: $page_path" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
    
    # Find routes that import this page
    echo "### Routes Found:" >> "$LOG_FILE"
    routes_found=$(grep -r "import.*$page_name.*from.*magic-patterns" "$ROUTES_DIR" 2>/dev/null | grep -v "node_modules" | cut -d: -f1 | sed "s|$ROUTES_DIR/||g")
    
    if [ -z "$routes_found" ]; then
        echo "❌ NO ROUTES FOUND" >> "$LOG_FILE"
    else
        while IFS= read -r route; do
            echo "- $route" >> "$LOG_FILE"
        done <<< "$routes_found"
    fi
    
    echo "" >> "$LOG_FILE"
    
    # Check for navigation patterns in the component
    echo "### Navigation Patterns in Component:" >> "$LOG_FILE"
    
    # Check for navigate() calls
    nav_patterns=$(grep -E "navigate\(['\"]([^'\"]+)['\"]" "$page_file" 2>/dev/null | sed -E "s/.*navigate\(['\"]([^'\"]+)['\"].*/- Navigate to: \1/")
    if [ ! -z "$nav_patterns" ]; then
        echo "$nav_patterns" >> "$LOG_FILE"
    fi
    
    # Check for href links
    href_patterns=$(grep -E "href=['\"]\/[^'\"]+['\"]" "$page_file" 2>/dev/null | sed -E "s/.*href=['\"]([^'\"]+)['\"].*/- Link to: \1/")
    if [ ! -z "$href_patterns" ]; then
        echo "$href_patterns" >> "$LOG_FILE"
    fi
    
    if [ -z "$nav_patterns" ] && [ -z "$href_patterns" ]; then
        echo "- No navigation patterns found" >> "$LOG_FILE"
    fi
    
    echo "" >> "$LOG_FILE"
    echo "---" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
    
    COUNT=$((COUNT + 1))
done <<< "$PAGES"

echo "Log saved to: $LOG_FILE"