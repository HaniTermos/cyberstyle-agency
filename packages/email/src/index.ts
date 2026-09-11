export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export function renderBaseEmailLayout(title: string, bodyContentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0A0A0A;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #FFFFFF;
    }
    .wrapper {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background-color: #12141A;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 32px;
    }
    .brand {
      color: #00F0FF;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 24px;
    }
    .footer {
      margin-top: 32px;
      text-align: center;
      font-size: 12px;
      color: #8E95A5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="brand">CYBERSTYLE LLC</div>
      ${bodyContentHtml}
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} CYBERSTYLE LLC. All rights reserved.<br>
      https://cyberstyle.net
    </div>
  </div>
</body>
</html>
  `.trim();
}
