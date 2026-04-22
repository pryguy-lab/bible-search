# Production Deployment Notes

## Security Profile

This app includes:

- Strict security headers via Helmet
- Request input validation
- Translation allow-listing
- Per-IP rate limiting (Redis-backed when configured)
- Upstream request timeout handling
- Request telemetry logs and abuse threshold warnings

## Environment Variables

- `PORT`: Server listen port. Default `3000`.
- `NODE_ENV`: Set to `production` in deployed environments.
- `TRUST_PROXY`: Set to `1` when running behind a reverse proxy (NGINX, Cloudflare, AWS ALB, etc.).
- `REDIS_URL`: Optional. When set, rate limiting uses Redis for multi-instance consistency.
- `LOG_REQUESTS`: Set to `0` to disable per-request JSON logs.
- `ALERT_WINDOW_MS`: Time window for abuse alert counters (default `60000`).
- `ALERT_4XX_THRESHOLD`: 4xx request count threshold per IP within the alert window (default `25`).
- `ALERT_429_THRESHOLD`: 429 request count threshold per IP within the alert window (default `10`).

## Reverse Proxy Hardening

1. Terminate TLS at the proxy.
2. Forward `X-Forwarded-For` and `X-Forwarded-Proto` to the Node app.
3. Set `TRUST_PROXY=1` so IP-based rate limiting uses real client IPs.
4. Restrict incoming traffic to HTTPS only.
5. Keep request body size and header size limits low at the proxy.
6. Configure `REDIS_URL` for shared rate-limiting state across multiple app instances.

## Example Run (Windows PowerShell)

```powershell
$env:NODE_ENV = "production"
$env:TRUST_PROXY = "1"
$env:REDIS_URL = "redis://127.0.0.1:6379"
$env:PORT = "3000"
npm start
```

## Verify Security

Run this while the app is running:

```powershell
npm run security:check
```

The script verifies headers, validation behavior, and that rate limiting triggers under burst traffic.

## Deploy Free on Render

This repo includes a Render blueprint file (`render.yaml`) for one-click setup.

1. Push this project to GitHub.
2. In Render, click **New +** and choose **Blueprint**.
3. Select your GitHub repository.
4. Render reads `render.yaml` and creates a **Free Web Service**.
5. Confirm deploy and wait for a public URL (for example, `https://your-app.onrender.com`).

Free tier note:

- Free services can spin down when idle, so the first request may be slower.

Environment values in `render.yaml`:

- `NODE_ENV=production`
- `TRUST_PROXY=1`
- `LOG_REQUESTS=0`
- `ALERT_WINDOW_MS=60000`
- `ALERT_4XX_THRESHOLD=25`
- `ALERT_429_THRESHOLD=10`

Optional:

- Add `REDIS_URL` in Render Environment if you later use managed Redis.
