import Charity from "../models/Charity.js";
import Score from "../models/Score.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import ApiError from "../utils/apiError.js";
import {
  assertRequiredFields,
  validateEmail,
  validatePassword,
  validatePercentage
} from "../utils/validators.js";

const formatAuthResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  subscriptionStatus: user.subscriptionStatus,
  subscriptionType: user.subscriptionType,
  charityId: user.charityId,
  charityPercentage: user.charityPercentage,
  token: generateToken({ id: user._id, role: user.role })
});

export const signup = async (req, res) => {
  assertRequiredFields(req.body, ["name", "email", "password"]);

  const {
    name,
    email,
    password,
    charityId,
    charityPercentage = 10,
    subscriptionType = null,
    subscriptionStatus = false
  } = req.body;

  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid email");
  }
  if (!validatePassword(password)) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }
  if (!validatePercentage(Number(charityPercentage))) {
    throw new ApiError(400, "Charity percentage must be between 10 and 100");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  if (charityId) {
    const charity = await Charity.findById(charityId);
    if (!charity) {
      throw new ApiError(404, "Charity not found");
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    charityId: charityId || null,
    charityPercentage: Number(charityPercentage),
    subscriptionType: subscriptionStatus ? subscriptionType : null,
    subscriptionStatus: Boolean(subscriptionStatus && subscriptionType)
  });

  await Score.create({ userId: user._id, scores: [] });

  res.status(201).json({
    success: true,
    message: "Signup successful",
    data: formatAuthResponse(user)
  });
};

export const login = async (req, res) => {
  assertRequiredFields(req.body, ["email", "password"]);

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  res.json({
    success: true,
    message: "Login successful",
    data: formatAuthResponse(user)
  });
};

export const seedAdmin = async (_req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new ApiError(400, "Admin credentials missing in environment");
  }

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: "Platform Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      subscriptionStatus: true,
      subscriptionType: "yearly"
    });
  }

  res.json({
    success: true,
    message: "Admin ready",
    data: { email: admin.email }
  });
};
