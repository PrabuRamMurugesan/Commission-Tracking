// authMiddleware.js
import jwt from "jsonwebtoken";

export function authMiddleware(handler) {
  return async (req, res) => {
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    const authHeader = req.headers.authorization;
    console.log("🔍 [authMiddleware] token:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("⛔ No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ JWT verified:", decoded);
      req.user = decoded;

      return handler(req, res); // ✅ Pass control to your actual route
    } catch (err) {
      console.error("❌ Token verification failed:", err.message);
      return res.status(403).json({ message: "Token invalid" });
    }
  };
}
