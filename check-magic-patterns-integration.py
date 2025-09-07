#!/usr/bin/env python3
import os
import re
import json
from pathlib import Path

PAGES_DIR = "/users/johnshine/Dropbox/Fibonacco/goeventcity/Version2-GEC/when-the-fun/apps/web/app/components/magic-patterns/pages"
ROUTES_DIR = "/users/johnshine/Dropbox/Fibonacco/goeventcity/Version2-GEC/when-the-fun/apps/web/app/routes"
LOG_FILE = "/users/johnshine/Dropbox/Fibonacco/goeventcity/Version2-GEC/when-the-fun/MAGIC-PATTERNS-CHECK-LOG.json"

def find_all_pages():
    """Find all Magic Patterns pages"""
    pages = []
    for root, dirs, files in os.walk(PAGES_DIR):
        for file in files:
            if file.endswith('.tsx'):
                full_path = os.path.join(root, file)
                relative_path = os.path.relpath(full_path, PAGES_DIR)
                pages.append({
                    'path': relative_path,
                    'name': file[:-4],  # Remove .tsx
                    'full_path': full_path
                })
    return sorted(pages, key=lambda x: x['path'])

def find_route_for_page(page_info):
    """Try to find the route that uses this page"""
    page_name = page_info['name']
    
    # Search for imports of this page
    results = []
    for root, dirs, files in os.walk(ROUTES_DIR):
        for file in files:
            if file.endswith('.tsx'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r') as f:
                        content = f.read()
                        if f"import.*{page_name}.*from.*magic-patterns" in content or \
                           f"'{page_name}'" in content or \
                           f'"{page_name}"' in content:
                            relative_route = os.path.relpath(file_path, ROUTES_DIR)
                            results.append(relative_route)
                except:
                    pass
    
    return results

def check_page_content(page_path):
    """Check the page content for navigation issues"""
    issues = []
    try:
        with open(page_path, 'r') as f:
            content = f.read()
            
            # Check for navigate() calls
            navigate_matches = re.findall(r'navigate\([\'"`]([^\'"`]+)[\'"`]\)', content)
            for match in navigate_matches:
                issues.append(f"Navigate to: {match}")
            
            # Check for href links
            href_matches = re.findall(r'href=[\'"`]([^\'"`]+)[\'"`]', content)
            for match in href_matches:
                if match.startswith('/'):
                    issues.append(f"Link to: {match}")
                    
            # Check for required props
            prop_matches = re.findall(r'interface.*Props.*{([^}]+)}', content, re.DOTALL)
            for match in prop_matches:
                issues.append(f"Props required: {match.strip()}")
                
    except Exception as e:
        issues.append(f"ERROR reading file: {e}")
    
    return issues

def main():
    print("Starting Magic Patterns Integration Check...")
    
    pages = find_all_pages()
    print(f"Found {len(pages)} Magic Patterns pages")
    
    results = []
    
    for i, page in enumerate(pages):
        print(f"\nChecking page {i+1}/{len(pages)}: {page['path']}")
        
        # Find routes using this page
        routes = find_route_for_page(page)
        
        # Check page content
        issues = check_page_content(page['full_path'])
        
        result = {
            'index': i + 1,
            'page': page['path'],
            'name': page['name'],
            'routes_found': routes,
            'has_route': len(routes) > 0,
            'navigation_issues': issues,
            'status': 'OK' if len(routes) > 0 else 'NO ROUTE'
        }
        
        results.append(result)
        
        # Print summary
        if result['has_route']:
            print(f"  ✅ Routes found: {', '.join(routes)}")
        else:
            print(f"  ❌ NO ROUTE FOUND")
            
        if issues:
            print(f"  ⚠️  Navigation/Props: {len(issues)} items to check")
    
    # Save results
    with open(LOG_FILE, 'w') as f:
        json.dump({
            'total_pages': len(pages),
            'pages_with_routes': sum(1 for r in results if r['has_route']),
            'pages_without_routes': sum(1 for r in results if not r['has_route']),
            'results': results
        }, f, indent=2)
    
    print(f"\n\nResults saved to: {LOG_FILE}")
    print(f"Total pages: {len(pages)}")
    print(f"Pages with routes: {sum(1 for r in results if r['has_route'])}")
    print(f"Pages WITHOUT routes: {sum(1 for r in results if not r['has_route'])}")

if __name__ == "__main__":
    main()