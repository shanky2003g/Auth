const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const  User = require("../db/models/user_model.js");
const saltrounds = 10; //Work Factor
JWT_SECRET = process.env.JWT_SECRET;


async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "Missing details",
    });
  }
  try {
    const existing_user = await User.findOne({ email });
    if (existing_user) {
      return res.json({
        success: false,
        message: "User already exist",
      });
    }
    bcrypt.hash(password, saltrounds, async function (err, hash) {
      if (err) {
        return res.json({
          success: false,
          message: "Error hashing password",
        });
      }

      const user = await User.create({
        name,
        email,
        password: hash,
      });

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "Production",
        sameSite: process.env.NODE_ENV === "Production" ? "none" : "strict",
        maxAge: 1 * 24 * 60 * 1000,
      });

      return res.json({ success: true });
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }
  try {
    const user =  await User.findOne({ email });
    // console.log(user)
    if (!user) {
      return res.json({
        success: false,
        message: "Invalid Email",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }
      
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "Production",
      sameSite: process.env.NODE_ENV === "Production" ? "none" : "strict",
      maxAge: 1 * 24 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {}
}

async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "Production",
      sameSite: process.env.NODE_ENV === "Production" ? "none" : "strict",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    //console.error('Error during logout:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = {
  register,
  login,
  logout,
};
