import jwt from "jsonwebtoken";

// Verify Token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      req.user = jwt.verify(token, process.env.JWT_SEC);
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
};

export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "not Allowed only Admin",
      });
    }
  });
};

export const verifyTokenAndOnlyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "not Allowed only User",
      });
    }
  });
};

export const verifyTokenAdminAndOnlyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "not Allowed",
      });
    }
  });
};
