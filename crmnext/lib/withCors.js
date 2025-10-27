// // C:\Users\BBS\BBS\CRM\Commission-Tracking\crmnext\lib\withCors.js
// [F:\Commission app\2025\October\Commission-Tracking(25Oct2025 7.30pm)\crmnext\lib\withCors.js
// const allowlist = new Set(['http://localhost:5173', 'https://bbscart.com']);

// export function withCors(handler) {
//   return async (req, res) => {
//     const origin = req.headers.origin;

//     if (origin && allowlist.has(origin)) {
//       res.setHeader('Access-Control-Allow-Origin', origin);
//       res.setHeader('Vary', 'Origin');
//     } else if (!origin) {
//       // server-to-server calls (curl/axios) have no Origin -> allow
//       res.setHeader('Access-Control-Allow-Origin', '*');
//     }

//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
//     res.setHeader(
//       'Access-Control-Allow-Headers',
//       'Content-Type, Authorization, X-Idempotency-Key, X-Source-App, X-Requested-With, Accept, Origin'
//     );

//     if (req.method === 'OPTIONS') return res.status(204).end();
//     return handler(req, res);
//   };
// }


// CRM Next.js CORS middleware (clean, production-ready)
// const allowlist = new Set(['http://localhost:5173', 'https://bbscart.com']);

// the following are updated on 26 oct.2025 before 20:30 IST.
// export function withCors(handler) {
//   return async (req, res) => {
//     const origin = req.headers.origin;

//     if (origin && allowlist.has(origin)) {
//       res.setHeader('Access-Control-Allow-Origin', origin);
//       res.setHeader('Vary', 'Origin');
//     } else if (!origin) {
//       // Allow internal server-to-server calls
//       res.setHeader('Access-Control-Allow-Origin', '*');
//     }

//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
//     res.setHeader(
//       'Access-Control-Allow-Headers',
//       'Content-Type, Authorization, X-Idempotency-Key, X-Source-App, X-Requested-With, Accept, Origin'
//     );

//     if (req.method === 'OPTIONS') return res.status(204).end();
//     return handler(req, res);
//   };
// }


// lib/withCors.js — clean, production-ready CORS middleware

const allowlist = new Set(['http://localhost:5173',  'http://localhost:5174','https://bbscart.com']);

export function withCors(handler) {
  return async (req, res) => {
    const origin = req.headers.origin;

    if (origin && allowlist.has(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    } else if (!origin) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Idempotency-Key, X-Source-App, X-Requested-With, Accept, Origin'
    );

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    return handler(req, res);
  };
}

// ✅ Default export for existing code that does:
// import handleCors from "../../../lib/withCors";
export default async function handleCors(req, res) {
  const origin = req.headers.origin;

  if (origin && allowlist.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Idempotency-Key, X-Source-App, X-Requested-With, Accept, Origin'
  );

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
}
