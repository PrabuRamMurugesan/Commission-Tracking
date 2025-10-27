import { withCors } from '../../../lib/withCors';
import { serviceToken } from '../../../lib/crmSecurity';
import { checkAndLock } from '../../../lib/idempotencyService';

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

  const auth = req.headers.authorization || '';
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7) : '';
  if (token !== serviceToken) return res.status(401).json({ ok: false, error: 'invalid service token' });

  const key = req.headers['x-idempotency-key'];
  const body = req.body || {};
  const lock = await checkAndLock('product-upsert', key, body);
  if (!lock.ok && lock.reason === 'duplicate_exact') return res.json({ ok: true, dedup: true });
  if (!lock.ok) return res.status(409).json({ ok: false, error: lock.reason });

  return res.json({ ok: true, received: true });
}

export default withCors(handler);
