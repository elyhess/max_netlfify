/**
 * One-time script to obtain a Gmail API refresh token.
 *
 * Prerequisites:
 *   1. Create a Google Cloud project at https://console.cloud.google.com
 *   2. Enable the Gmail API
 *   3. Create OAuth 2.0 credentials (Desktop app type)
 *   4. Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in your environment
 *
 * Usage:
 *   GMAIL_CLIENT_ID=xxx GMAIL_CLIENT_SECRET=yyy node scripts/gmail-oauth-setup.mjs
 *
 * The script opens a browser for Google sign-in, then prints the refresh token.
 */

import { createServer } from 'node:http'
import { URL } from 'node:url'
import { google } from 'googleapis'

const CLIENT_ID = process.env.GMAIL_CLIENT_ID
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    'Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in your environment first.\n' +
    'Example: GMAIL_CLIENT_ID=xxx GMAIL_CLIENT_SECRET=yyy node scripts/gmail-oauth-setup.mjs',
  )
  process.exit(1)
}

const PORT = 3847
const REDIRECT_URI = `http://localhost:${PORT}/callback`
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/drive.readonly',
]

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
})

console.log('\nOpening browser for Google sign-in...\n')
console.log('If it does not open automatically, visit:\n')
console.log(authUrl, '\n')

const open = await import('node:child_process').then((cp) => {
  const platform = process.platform
  const cmd = platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open'
  return (url) => cp.exec(`${cmd} "${url}"`)
})

open(authUrl)

const server = createServer(async (req, res) => {
  if (!req.url?.startsWith('/callback')) {
    res.writeHead(404)
    res.end()
    return
  }

  const url = new URL(req.url, `http://localhost:${PORT}`)
  const code = url.searchParams.get('code')

  if (!code) {
    res.writeHead(400)
    res.end('Missing authorization code.')
    return
  }

  try {
    const { tokens } = await oauth2Client.getToken(code)

    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end('<h2>Done! You can close this tab.</h2><p>Check your terminal for the refresh token.</p>')

    console.log('--------------------------------------------------')
    console.log('GMAIL_REFRESH_TOKEN=' + tokens.refresh_token)
    console.log('--------------------------------------------------')
    console.log('\nAdd this to your Netlify environment variables.\n')
  } catch (err) {
    res.writeHead(500)
    res.end('Token exchange failed.')
    console.error('Token exchange failed:', err)
  } finally {
    server.close()
    process.exit(0)
  }
})

server.listen(PORT, () => {
  console.log(`Waiting for OAuth callback on http://localhost:${PORT}/callback ...\n`)
})
