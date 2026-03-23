import type { Handler } from '@netlify/functions'
import { google } from 'googleapis'
import sharp from 'sharp'

const THUMB_WIDTH = 800
const THUMB_QUALITY = 75

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GALLERY_FOLDER_ID } =
    process.env

  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !GALLERY_FOLDER_ID) {
    console.error('Missing Google Drive environment variables')
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Gallery is not configured.' }),
    }
  }

  try {
    const oauth2Client = new google.auth.OAuth2(GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET)
    oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN })

    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    const res = await drive.files.list({
      q: `'${GALLERY_FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'files(id, name, description)',
      pageSize: 50,
    })

    const sorted = (res.data.files ?? []).sort((a, b) =>
      (a.name ?? '').localeCompare(b.name ?? '', undefined, { numeric: true }),
    )

    const files = await Promise.all(
      sorted.map(async (file) => {
        const imgRes = await drive.files.get(
          { fileId: file.id!, alt: 'media' },
          { responseType: 'arraybuffer' },
        )

        const thumbnail = await sharp(Buffer.from(imgRes.data as ArrayBuffer))
          .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
          .webp({ quality: THUMB_QUALITY })
          .toBuffer()

        const base64 = thumbnail.toString('base64')

        return {
          id: file.id,
          name: file.name,
          alt: file.description ?? file.name ?? '',
          src: `data:image/webp;base64,${base64}`,
        }
      }),
    )

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
      body: JSON.stringify(files),
    }
  } catch (error) {
    console.error('Gallery fetch failed:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load gallery.' }),
    }
  }
}
