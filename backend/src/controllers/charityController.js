import Charity from "../models/Charity.js";
import ApiError from "../utils/apiError.js";
import { assertRequiredFields } from "../utils/validators.js";

export const getCharities = async (_req, res) => {
  const charities = await Charity.find({ isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, data: charities });
};

export const createCharity = async (req, res) => {
  assertRequiredFields(req.body, ["name", "description"]);
  const charity = await Charity.create(req.body);
  res.status(201).json({ success: true, message: "Charity created", data: charity });
};

export const updateCharity = async (req, res) => {
  const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!charity) {
    throw new ApiError(404, "Charity not found");
  }

  res.json({ success: true, message: "Charity updated", data: charity });
};
