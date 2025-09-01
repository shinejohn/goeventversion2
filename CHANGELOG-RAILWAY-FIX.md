# Railway Deployment Fix - Change Log

## Issue
Railway deployment is failing with error: `ERR_PNPM_NO_SCRIPT_OR_SERVER Missing script start or file server.js`

## Root Cause
The `railway.toml` configuration is set up for a single package project, but MakerKit uses Turborepo monorepo structure where:
- Root `package.json` has no `start` script
- The actual `start` script is in `apps/web/package.json`

## Current Configuration (Incorrect)
```toml
[deploy]
startCommand = "pnpm start"
```

## Proposed Fix

### Step 1: Update railway.toml
Change the start command to target the web workspace specifically:

```toml
[build]
builder = "nixpacks"
buildCommand = "pnpm install && pnpm build"

[deploy]
startCommand = "pnpm --filter web start"
healthcheckPath = "/health"
healthcheckTimeout = 300

[environment]
NODE_ENV = "production"
PORT = { fromService = "web" }
```

### Step 2: Verify the build output
The `apps/web/package.json` start script expects:
```json
"start": "cross-env NODE_ENV=production react-router-serve ./build/server/index.js"
```

This means the build must create `./build/server/index.js` in the `apps/web` directory.

### Step 3: Alternative if Step 1 doesn't work
If Railway still has issues with the monorepo structure, we could add a root-level start script:

In root `package.json`, add:
```json
"scripts": {
  ...existing scripts...,
  "start": "pnpm --filter web start"
}
```

This would allow the current `railway.toml` to work as-is.

## Risks
- This is MakerKit's code, not ours - we should be careful not to break their update path
- The `railway.toml` might be intentionally generic for users to customize
- There might be other Railway-specific environment variables needed

## Recommendation
Try Step 1 first (updating railway.toml) as it's the least invasive change and keeps all modifications in deployment configuration rather than touching MakerKit's core files.

## Reversal Instructions

### To Revert Step 1 (railway.toml change):
Restore the original `railway.toml`:
```toml
[build]
builder = "nixpacks"
buildCommand = "pnpm install && pnpm build"

[deploy]
startCommand = "pnpm start"
healthcheckPath = "/health"
healthcheckTimeout = 300

[environment]
NODE_ENV = "production"
PORT = { fromService = "web" }
```

### To Revert Step 3 (if root package.json was modified):
Remove the added `"start"` script from root `package.json`.

### Backup Strategy
Before making any changes:
1. Create a backup of `railway.toml`: `cp railway.toml railway.toml.backup`
2. If modifying root `package.json`: `cp package.json package.json.backup`

## Additional Issue: React Router Version Compatibility

### Step 4: Verify Magic Patterns React Router 7 Compliance
Magic Patterns components may be using React Router 6 patterns that are incompatible with React Router 7.

**Common React Router 6 → 7 Changes:**
- `useNavigate()` → Still valid but usage patterns may differ
- `useParams()` → Still valid
- `useSearchParams()` → Still valid  
- `useLoaderData()` → Still valid
- Route definitions and component patterns may need updates
- Import paths may have changed

**Action Required:**
1. Scan all Magic Patterns components for React Router imports and usage
2. Identify any React Router 6-specific patterns
3. Update to React Router 7 compliance
4. Test all navigation and routing functionality

**Risk:**
If Magic Patterns were generated for React Router 6, they may break routing functionality in the React Router 7 environment.

---
Created: 2025-09-01
Status: Proposed, not yet implemented