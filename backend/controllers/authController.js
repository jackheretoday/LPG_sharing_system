const bcrypt = require("bcryptjs");
const {
  createUser,
  findUserByEmail,
  findUserById,
} = require("../models/tempUserStore");
const { generateToken } = require("../utilis/token");

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email and password are required");
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      res.status(409);
      throw new Error("User already exists with this email");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser({ name, email, passwordHash });

    const token = generateToken({ id: user.id, email: user.email });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      note: "Temporary in-memory auth store. Replace with Supabase DB when ready.",
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = findUserByEmail(email);
    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const token = generateToken({ id: user.id, email: user.email });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      note: "Temporary in-memory auth store. Replace with Supabase DB when ready.",
    });
  } catch (error) {
    return next(error);
  }
};

const me = (req, res, next) => {
  try {
    const user = findUserById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signup,
  login,
  me,
};
