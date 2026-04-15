const { verifyToken } = require("../utilis/token");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    return next(new Error("Not authorized, token missing"));
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = verifyToken(token);
    return next();
  } catch (error) {
    res.status(401);
    return next(new Error("Not authorized, invalid token"));
  }
};

module.exports = {
  protect,
};
