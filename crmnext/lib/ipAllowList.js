import { allowedIps } from './crmSecurity';

export function ipAllowList(req) {
  if (!allowedIps || allowedIps.length === 0) return null;
  const ip = (req.headers.get('x-forwarded-for') || req.ip || 'unknown').toString();
  const pass = allowedIps.some(a => ip.includes(a));
  if (!pass)
    return new Response(JSON.stringify({ ok: false, error: `blocked ${ip}` }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  return null;
}
