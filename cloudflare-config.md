## Cloudflare Configuration for When's The Fun

### 1. DNS Settings
- Type: CNAME
- Name: @ (or subdomain)
- Target: your-app.up.railway.app
- Proxy Status: Proxied (Orange Cloud ON)

### 2. SSL/TLS Settings
- Encryption Mode: Full (strict)
- Always Use HTTPS: ON
- Automatic HTTPS Rewrites: ON

### 3. Speed Settings
- Auto Minify: JavaScript, CSS, HTML
- Brotli: ON
- Rocket Loader: OFF (can break React)
- Mirage: ON (mobile optimization)

### 4. Caching Settings
- Browser Cache TTL: 4 hours
- Always Online: ON

### 5. Network Settings
- HTTP/3 (with QUIC): ON
- WebSockets: ON (for real-time features)
- IP Geolocation: ON (IMPORTANT!)

### 6. Security Settings
- Bot Fight Mode: ON
- Challenge Passage: 30 minutes
- Security Level: Medium