import Charity from "../models/Charity.js";

const defaultCharities = [
  {
    name: "First Tee Youth Golf",
    description: "Helping young players learn golf fundamentals, discipline, and confidence.",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b"
  },
  {
    name: "Fairway Futures Fund",
    description: "Supporting golf access programs and local training scholarships.",
    image: "https://images.unsplash.com/photo-1517602302552-471fe67acf66"
  },
  {
    name: "Greens for Good",
    description: "Backing community wellness, inclusive coaching, and sustainable golf initiatives.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211"
  }
];

const bootstrapDefaultCharities = async () => {
  const existingCount = await Charity.countDocuments();

  if (existingCount > 0) {
    return;
  }

  await Charity.insertMany(defaultCharities);
  console.log("Default charities created");
};

export default bootstrapDefaultCharities;
