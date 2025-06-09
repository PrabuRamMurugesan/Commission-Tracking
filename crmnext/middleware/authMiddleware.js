import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

/**
 * Auth Middleware for API Routes
 * Supports optional role restriction
 *
 * @param {Array<string>} allowedRoles (optional)
 * @returns {Function} Express-style middleware
 */
export function authMiddleware(allowedRoles = []) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Missing token" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Inject secure user info into request
      req.user = {
        _id: decoded._id,
        role: decoded.role,
        email: decoded.email,
        name: decoded.name || "User",
      };

      // Role check if enforced
      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: Role not allowed" });
      }

     await next();
    } catch (err) {
      console.error("AuthMiddleware Error:", err);
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid or expired token" });
    }
  };
}
