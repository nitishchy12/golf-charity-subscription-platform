import mongoose from "mongoose";

const winnerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    drawId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Draw",
      required: true
    },
    matchType: {
      type: Number,
      enum: [3, 4, 5],
      required: true
    },
    amount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["pending", "paid", "rejected", "approved"],
      default: "pending"
    },
    proof: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const Winner = mongoose.model("Winner", winnerSchema);

export default Winner;
