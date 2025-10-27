export default function handler(req, res) {
  res.status(200).json({ ok: true, service: 'crm-ingest', time: new Date().toISOString() });
}
