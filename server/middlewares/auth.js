export const protect = (req, res, next) => {
  const { userId } = req.auth?.() || {};

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.userId = userId;
  next();
};
