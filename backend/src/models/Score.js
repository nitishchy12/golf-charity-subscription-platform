import mongoose from "mongoose";

const scoreEntrySchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 45
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    scores: {
      type: [scoreEntrySchema],
      default: []
    }
  },
  { timestamps: true }
);

const Score = mongoose.model("Score", scoreSchema);

export default Score;
