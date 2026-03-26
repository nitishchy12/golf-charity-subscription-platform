import Draw from "../models/Draw.js";
import Score from "../models/Score.js";
import User from "../models/User.js";
import Winner from "../models/Winner.js";
import ApiError from "../utils/apiError.js";

const createUniqueDrawNumbers = () => {
  const numbers = new Set();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return [...numbers].sort((a, b) => a - b);
};

const calculateMatchCount = (scores, drawNumbers) => {
  const scoreSet = new Set(scores.map((entry) => entry.value));
  return drawNumbers.filter((number) => scoreSet.has(number)).length;
};

const prizeShareByMatch = {
  5: 0.4,
  4: 0.35,
  3: 0.25
};

export const runMonthlyDraw = async ({ prizePool, monthKey }) => {
  const existingDraw = await Draw.findOne({ monthKey });
  if (existingDraw) {
    throw new ApiError(400, `Draw already exists for ${monthKey}`);
  }

  const drawNumbers = createUniqueDrawNumbers();
  const draw = await Draw.create({
    drawNumbers,
    monthKey,
    prizePool: prizePool || Number(process.env.DEFAULT_DRAW_POOL || 10000)
  });

  const userScores = await Score.find({ "scores.0": { $exists: true } }).populate("userId");
  const winnerBuckets = { 3: [], 4: [], 5: [] };

  for (const entry of userScores) {
    const matchCount = calculateMatchCount(entry.scores, drawNumbers);
    if ([3, 4, 5].includes(matchCount)) {
      winnerBuckets[matchCount].push(entry.userId._id);
    }
  }

  const createdWinners = [];
  for (const matchType of [3, 4, 5]) {
    const winners = winnerBuckets[matchType];
    if (!winners.length) {
      continue;
    }

    const bucketAmount = draw.prizePool * prizeShareByMatch[matchType];
    const splitAmount = Number((bucketAmount / winners.length).toFixed(2));

    for (const userId of winners) {
      const winner = await Winner.create({
        userId,
        drawId: draw._id,
        matchType,
        amount: splitAmount
      });
      createdWinners.push(winner._id);
      await User.findByIdAndUpdate(userId, { $inc: { winningsTotal: splitAmount } });
    }
  }

  draw.winners = createdWinners;
  await draw.save();

  return Draw.findById(draw._id).populate({
    path: "winners",
    populate: { path: "userId", select: "name email" }
  });
};
