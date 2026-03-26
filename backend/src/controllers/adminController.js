import User from "../models/User.js";
import Winner from "../models/Winner.js";
import ApiError from "../utils/apiError.js";

export const getUsers = async (_req, res) => {
  const users = await User.find().populate("charityId").select("-password").sort({ createdAt: -1 });
  res.json({ success: true, data: users });
};

export const updateUserSubscription = async (req, res) => {
  const { subscriptionStatus, subscriptionType } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      subscriptionStatus: Boolean(subscriptionStatus),
      subscriptionType: subscriptionStatus ? subscriptionType : null
    },
    { new: true }
  ).populate("charityId");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({ success: true, message: "User subscription updated", data: user });
};

export const updateWinnerStatus = async (req, res) => {
  const { status } = req.body;
  const winner = await Winner.findByIdAndUpdate(req.params.id, { status }, { new: true })
    .populate("userId", "name email")
    .populate("drawId", "monthKey");

  if (!winner) {
    throw new ApiError(404, "Winner not found");
  }

  res.json({ success: true, message: "Winner status updated", data: winner });
};
