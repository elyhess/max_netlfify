/**
 * Send an inquiry via the Netlify function (Gmail API backend).
 *
 * @param {object} payload
 * @param {string} payload.firstName
 * @param {string} payload.email
 * @param {string} payload.phone
 * @param {string} payload.description
 * @param {string} payload.location
 * @param {Array<{dataUrl: string, name: string}>} payload.references
 */
export default async function sendInquiry(payload) {
   const response = await fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
   });

   if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || 'Failed to send inquiry.');
   }

   return response.json();
}
