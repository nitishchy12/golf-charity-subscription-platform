import Charity from "../models/Charity.js";
import Draw from "../models/Draw.js";
import Score from "../models/Score.js";
import Winner from "../models/Winner.js";
import User from "../models/User.js";
import ApiError from "../utils/apiError.js";
import {
  assertRequiredFields,
  validatePercentage,
  validateScore
} from "../utils/validators.js";

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate("charityId");
  const scoreDoc = await Score.findOne({ userId: req.user._id });
  const wins = await Winner.find({ userId: req.user._id })
    .populate("drawId", "monthKey drawNumbers")
    .sort({ createdAt: -1 });
  const draws = await Draw.find().sort({ runAt: -1 }).limit(6);

  res.json({
    success: true,
    data: {
      user,
      scores: [...(scoreDoc?.scores || [])].sort((a, b) => new Date(b.date) - new Date(a.date)),
      wins,
      recentDraws: draws
    }
  });
};

export const updateSubscription = async (req, res) => {
  assertRequiredFields(req.body, ["subscriptionType", "subscriptionStatus"]);
  const { subscriptionType, subscriptionStatus } = req.body;

  if (!["monthly", "yearly"].includes(subscriptionType)) {
    throw new ApiError(400, "Subscription type must be monthly or yearly");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      subscriptionType: subscriptionStatus ? subscriptionType : null,
      subscriptionStatus: Boolean(subscriptionStatus)
    },
    { new: true }
  ).populate("charityId");

  res.json({
    success: true,
    message: "Subscription updated",
    data: user
  });
};

export const addScore = async (req, res) => {
  assertRequiredFields(req.body, ["value"]);
  const value = Number(req.body.value);

  if (!validateScore(value)) {
    throw new ApiError(400, "Score must be an integer between 1 and 45");
  }

  const scoreDoc = await Score.findOne({ userId: req.user._id });
  if (!scoreDoc) {
    throw new ApiError(404, "Score profile not found");
  }

  scoreDoc.scores.push({ value, date: new Date() });
  if (scoreDoc.scores.length > 5) {
    scoreDoc.scores = scoreDoc.scores.slice(-5);
  }
  await scoreDoc.save();

  res.status(201).json({
    success: true,
    message: "Score added",
    data: [...scoreDoc.scores].sort((a, b) => new Date(b.date) - new Date(a.date))
  });
};

export const getScores = async (req, res) => {
  const scoreDoc = await Score.findOne({ userId: req.user._id });

  res.json({
    success: true,
    data: [...(scoreDoc?.scores || [])].sort((a, b) => new Date(b.date) - new Date(a.date))
  });
};

export const updateCharitySelection = async (req, res) => {
  assertRequiredFields(req.body, ["charityId", "charityPercentage"]);

  const { charityId, charityPercentage } = req.body;
  if (!validatePercentage(Number(charityPercentage))) {
    throw new ApiError(400, "Charity percentage must be between 10 and 100");
  }

  const charity = await Charity.findById(charityId);
  if (!charity) {
    throw new ApiError(404, "Charity not found");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      charityId,
      charityPercentage: Number(charityPercentage)
    },
    { new: true }
  ).populate("charityId");

  res.json({
    success: true,
    message: "Charity selection updated",
    data: user
  });
};

export const uploadWinnerProof = async (req, res) => {
  const { winnerId } = req.params;
  if (!req.file) {
    throw new ApiError(400, "Proof file is required");
  }

  const winner = await Winner.findOne({ _id: winnerId, userId: req.user._id });
  if (!winner) {
    throw new ApiError(404, "Winner record not found");
  }

  winner.proof = `/uploads/${req.file.filename}`;
  winner.status = "pending";
  await winner.save();

  res.json({
    success: true,
    message: "Proof uploaded",
    data: winner
  });
};
