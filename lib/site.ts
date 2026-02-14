/**
 * Site-wide contact and business details.
 */

export const SITE = {
  email: 'hello@nextlevelweb.ie',
  /** E.164: Ireland +353, mobile 89 278 1782 (no leading 0) */
  phone: '0892781782',
  phoneE164: '353892781782',
  address: '38 Easton Drive, Leixlip, Co. Kildare',
  addressShort: 'Leixlip, Co. Kildare',
} as const;

/**
 * Pre-filled message for WhatsApp — mirrors contact form fields so you receive the same info.
 */
export const WHATSAPP_PREFILL_MESSAGE = `Hi, I'd like to get in touch about a website.

Name: 
Email: 
Company: 
Package: (Starter €900 / Growth €1,200 / Premium €2,000 / Custom)
Message: `;

export const WHATSAPP_URL = `https://wa.me/${SITE.phoneE164}?text=${encodeURIComponent(WHATSAPP_PREFILL_MESSAGE)}`;
