/**
 * reCAPTCHA v2 server-side verification.
 * Verify the token from the client with Google's API.
 */

const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret || !token) {
    return false;
  }
  const params = new URLSearchParams({
    secret,
    response: token,
  });
  const res = await fetch(VERIFY_URL, {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}
