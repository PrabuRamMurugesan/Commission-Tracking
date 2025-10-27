import 'dotenv/config';

export const serviceToken = process.env.SERVICE_TOKEN;
export const allowedIps = (process.env.ALLOWED_IPS || '')
  .split(',')
  .map(x => x.trim())
  .filter(Boolean);
