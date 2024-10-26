const User = require("../models/user");

exports.getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User info not found", 404);
    }
    const { name, profileImage, email } = user;
    res.status(200).json({
      name,
      profileImage,
      email,
    });
  } catch (error) {
    next(error);
  }
};
