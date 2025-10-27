import { serviceToken } from './crmSecurity';

export function verifyServiceToken(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.toLowerCase().startsWith('bearer ')
    ? auth.slice(7)
    : '';
  if (token !== serviceToken) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid service token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return null;
}
