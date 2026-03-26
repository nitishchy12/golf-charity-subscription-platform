import mongoose from "mongoose";

const drawSchema = new mongoose.Schema(
  {
    drawNumbers: {
      type: [Number],
      required: true,
      validate: [(value) => value.length === 5, "Draw must have 5 numbers"]
    },
    monthKey: {
      type: String,
      required: true,
      unique: true
    },
    prizePool: {
      type: Number,
      default: 10000
    },
    winners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Winner"
      }
    ],
    runAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Draw = mongoose.model("Draw", drawSchema);

export default Draw;
