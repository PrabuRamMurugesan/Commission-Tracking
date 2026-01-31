export const adminCheck = (handler) => async (req, res) => {
  const userRole = req.headers["x-user-role"];
  if (userRole !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  return handler(req, res);
};
