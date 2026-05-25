export function baseTemplate(content: string, orgName: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f4; }
    .container { max-width: 560px; margin: 0 auto; padding: 40px 20px; }
    .card { background: white; border-radius: 16px; padding: 32px; border: 1px solid #e7e5e4; }
    .logo { font-size: 20px; font-weight: 700; color: #1c1917; margin-bottom: 24px; }
    .title { font-size: 22px; font-weight: 600; color: #1c1917; margin: 0 0 12px; }
    .text { font-size: 15px; color: #57534e; line-height: 1.6; margin: 0 0 16px; }
    .button { display: inline-block; padding: 12px 24px; background: #1c1917; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500; }
    .detail { background: #fafaf9; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; }
    .detail-label { color: #78716c; }
    .detail-value { color: #1c1917; font-weight: 500; }
    .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #a8a29e; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">${orgName}</div>
      ${content}
    </div>
    <div class="footer">
      <p>© 2026 ${orgName} · Powered by Yogara</p>
    </div>
  </div>
</body>
</html>`
}
