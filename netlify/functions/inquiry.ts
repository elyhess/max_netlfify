import type { Handler } from '@netlify/functions'
import { google } from 'googleapis'
import MailComposer from 'nodemailer/lib/mail-composer/index.js'

type Attachment = {
  dataUrl: string
  name: string
}

type InquiryBody = {
  firstName: string
  email: string
  phone: string
  description: string
  location: string
  references: Attachment[]
}

function dataUrlToBuffer(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/s)
  if (!match) throw new Error('Invalid data URL')
  return { mimeType: match[1], buffer: Buffer.from(match[2], 'base64') }
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildHtml(data: InquiryBody) {
  const rows = [
    ['Name', data.firstName],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Body Placement', data.location],
  ]

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 12px">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  return `
    <div style="font-family:sans-serif;max-width:600px">
      <h2>New Tattoo Inquiry</h2>
      <table style="border-collapse:collapse;width:100%">${rowsHtml}</table>
      <h3 style="margin-top:24px">Description</h3>
      <p style="white-space:pre-wrap">${escapeHtml(data.description)}</p>
      <p style="color:#888;font-size:12px;margin-top:32px">
        Sent from maxvktattoos.com inquiry form &middot; ${data.references.length} reference image${data.references.length !== 1 ? 's' : ''} attached
      </p>
    </div>
  `
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, ARTIST_EMAIL } = process.env

  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !ARTIST_EMAIL) {
    console.error('Missing Gmail OAuth environment variables')
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Email delivery is not configured.' }),
    }
  }

  try {
    const data: InquiryBody = JSON.parse(event.body ?? '{}')
    const artistEmail = ARTIST_EMAIL

    const attachments = data.references.map((ref) => {
      const { mimeType, buffer } = dataUrlToBuffer(ref.dataUrl)
      return {
        filename: ref.name,
        content: buffer,
        contentType: mimeType,
      }
    })

    const mail = new MailComposer({
      from: artistEmail,
      to: artistEmail,
      replyTo: data.email,
      subject: `Tattoo inquiry from ${data.firstName || data.email}`,
      html: buildHtml(data),
      attachments,
    })

    const message = await mail.compile().build()
    const raw = Buffer.from(message).toString('base64url')

    const oauth2Client = new google.auth.OAuth2(GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET)
    oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN })

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw },
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    }
  } catch (error) {
    console.error('Inquiry send failed:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send inquiry.' }),
    }
  }
}
