// C:\Users\BBS\BBS\CRM\Commission-Tracking\crmnext\lib\idempotencyService.js
import crypto from 'crypto';
import mongoose from 'mongoose';

// --- ensure we are connected (lazy) ---
async function ensureConnected() {
  if (mongoose.connection.readyState === 1) return;
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI missing in environment');
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// --- schema / model ---
const idemSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  endpoint: { type: String, required: true },
  bodyHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'idempotency_keys' });

idemSchema.index({ key: 1 }, { unique: true });

const Idem = mongoose.models.IdempotencyKey || mongoose.model('IdempotencyKey', idemSchema);

// --- helpers ---
function hashBody(obj) {
  const json = JSON.stringify(obj || {});
  return crypto.createHash('sha256').update(json).digest('hex');
}

export async function checkAndLock(endpoint, key, body) {
  await ensureConnected();
  if (!key) return { ok: false, reason: 'missing_key' };

  const bodyHash = hashBody(body);

  try {
    await Idem.create({ key, endpoint, bodyHash });
    return { ok: true, bodyHash };
  } catch {
    const found = await Idem.findOne({ key });
    if (found && found.bodyHash === bodyHash) return { ok: false, reason: 'duplicate_exact' };
    return { ok: false, reason: 'duplicate_conflict' };
  }
}
