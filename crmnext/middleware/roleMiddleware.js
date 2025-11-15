
export const roleMiddleware = (allowedRoles) => {
  return (handler) => {
    return async (req, res) => {
      const role = req.user?.role;

      if (!role) {
        return res.status(401).json({ message: "Not logged in" });
      }

      if (!allowedRoles.includes(role)) {
        return res
          .status(403)
          .json({ message: `Access denied for role: ${role}` });
      }

      return handler(req, res);
    };
  };
};

