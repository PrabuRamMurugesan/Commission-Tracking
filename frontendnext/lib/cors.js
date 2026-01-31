import Cors from "cors";

// ✅ Secure and working CORS config
const cors = Cors({
  origin: "http://localhost:5174", // restrict to your frontend only
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true, // ✅ Allow cookies/auth headers
  allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow Authorization header
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      return result instanceof Error ? reject(result) : resolve(result);
    });
  });
}

export default async function handleCors(req, res) {
  await runMiddleware(req, res, cors);
}
