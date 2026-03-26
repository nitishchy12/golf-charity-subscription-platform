import Draw from "../models/Draw.js";
import Winner from "../models/Winner.js";
import { runMonthlyDraw } from "../services/drawService.js";

export const getDraws = async (_req, res) => {
  const draws = await Draw.find()
    .populate({
      path: "winners",
      populate: { path: "userId", select: "name email" }
    })
    .sort({ runAt: -1 });

  res.json({ success: true, data: draws });
};

export const createDraw = async (req, res) => {
  const date = req.body.monthKey ? new Date(`${req.body.monthKey}-01`) : new Date();
  const monthKey = req.body.monthKey || `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  const draw = await runMonthlyDraw({
    prizePool: Number(req.body.prizePool || 0) || undefined,
    monthKey
  });

  res.status(201).json({ success: true, message: "Draw generated", data: draw });
};

export const getWinners = async (_req, res) => {
  const winners = await Winner.find()
    .populate("userId", "name email")
    .populate("drawId", "monthKey drawNumbers")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: winners });
};
