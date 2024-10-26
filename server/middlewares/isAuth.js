const jwt = require("jsonwebtoken");

const tokenDecode = (req) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Error("Token is Absent", 401);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.user.batch = parseInt("20" + req.user.email.slice(0, 2), 10);
  } catch (error) {
    next(error);
  }
};

exports.isAuth = (req, res, next) => {
  try {
    err = tokenDecode(req);
    if (err) {
      throw err;
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.generateToken = (id, email) => {
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};
