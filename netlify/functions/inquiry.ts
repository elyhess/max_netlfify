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

/* ── Shared email styles ─────────────────────────────────────── */

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background-color:#090A0F;font-family:'Space Grotesk',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#090A0F;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#12141c;border:1px solid rgba(255,255,255,0.08);border-radius:16px;">
        <!-- Gradient header bar -->
        <tr>
          <td style="height:4px;background:linear-gradient(135deg,#f41dcf,#1990fe);border-radius:16px 16px 0 0;"></td>
        </tr>
        <tr><td style="padding:32px 32px 40px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
            <span style="color:rgba(255,255,255,0.3);font-size:12px;">MAX VK TATTOOS &middot; <a href="https://maxvktattoos.com" style="color:#1990fe;text-decoration:none;">maxvktattoos.com</a></span>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

/* ── Artist notification email ───────────────────────────────── */

function buildArtistHtml(data: InquiryBody) {
  const rows = [
    ['Name', data.firstName],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Body Placement', data.location],
  ]

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:10px 14px;color:#f41dcf;font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:10px 14px;color:#ffffff;font-size:15px;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('')

  return emailWrapper(`
    <h1 style="margin:0 0 4px;font-size:24px;font-weight:700;color:#ffffff;">New Tattoo Inquiry</h1>
    <p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.4);">Submitted via maxvktattoos.com</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;margin-bottom:24px;">
      ${rowsHtml}
    </table>

    <h2 style="margin:0 0 8px;font-size:16px;font-weight:600;color:#1990fe;">Description</h2>
    <p style="margin:0 0 24px;color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.description)}</p>

    <p style="margin:0;color:rgba(255,255,255,0.3);font-size:12px;">
      ${data.references.length} reference image${data.references.length !== 1 ? 's' : ''} attached &middot; Reply to this email to respond directly
    </p>
  `)
}

/* ── Client confirmation email ───────────────────────────────── */

function buildConfirmationHtml(data: InquiryBody) {
  return emailWrapper(`
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#ffffff;">Got your inquiry!</h1>
    <p style="margin:0 0 28px;font-size:16px;color:rgba(255,255,255,0.7);line-height:1.5;">
      Hey ${escapeHtml(data.firstName)}, thanks for reaching out! I&rsquo;ve received your tattoo inquiry and will review it soon.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;margin-bottom:28px;">
      <tr>
        <td style="padding:14px;color:#f41dcf;font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;white-space:nowrap;">Body Placement</td>
        <td style="padding:14px;color:#ffffff;font-size:15px;">${escapeHtml(data.location)}</td>
      </tr>
      <tr>
        <td style="padding:14px;color:#f41dcf;font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;white-space:nowrap;">Description</td>
        <td style="padding:14px;color:rgba(255,255,255,0.7);font-size:15px;line-height:1.5;white-space:pre-wrap;">${escapeHtml(data.description)}</td>
      </tr>
      <tr>
        <td style="padding:14px;color:#f41dcf;font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;white-space:nowrap;">References</td>
        <td style="padding:14px;color:rgba(255,255,255,0.7);font-size:15px;">${data.references.length} image${data.references.length !== 1 ? 's' : ''} uploaded</td>
      </tr>
    </table>

    <p style="margin:0 0 8px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.5;">
      No need to reply to this email &mdash; I&rsquo;ll reach out to you directly when I&rsquo;m ready to discuss your piece.
    </p>

    <p style="margin:24px 0 0;text-align:center;">
      <a href="https://www.instagram.com/maxvktattoos/" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#f41dcf,#1990fe);color:#ffffff;font-weight:600;font-size:14px;text-decoration:none;border-radius:50px;letter-spacing:0.5px;text-transform:uppercase;">Follow on Instagram</a>
    </p>
  `)
}

/* ── Handler ─────────────────────────────────────────────────── */

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

    const oauth2Client = new google.auth.OAuth2(GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET)
    oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN })
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Send inquiry to artist
    const artistMail = new MailComposer({
      from: artistEmail,
      to: artistEmail,
      replyTo: data.email,
      subject: `Tattoo inquiry from ${data.firstName || data.email}`,
      html: buildArtistHtml(data),
      attachments,
    })

    const artistMessage = await artistMail.compile().build()
    const artistRaw = Buffer.from(artistMessage).toString('base64url')

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: artistRaw },
    })

    // Send confirmation to client
    try {
      const confirmMail = new MailComposer({
        from: `MAX VK TATTOOS <${artistEmail}>`,
        to: data.email,
        subject: `We received your tattoo inquiry!`,
        html: buildConfirmationHtml(data),
      })

      const confirmMessage = await confirmMail.compile().build()
      const confirmRaw = Buffer.from(confirmMessage).toString('base64url')

      await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: confirmRaw },
      })
    } catch (confirmError) {
      console.error('Confirmation email failed (inquiry was delivered):', confirmError)
    }

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
