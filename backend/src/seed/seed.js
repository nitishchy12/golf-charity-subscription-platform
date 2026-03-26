import dotenv from "dotenv";
import connectDatabase from "../config/db.js";
import Charity from "../models/Charity.js";
import User from "../models/User.js";

dotenv.config();

const charities = [
  {
    name: "First Tee Youth Golf",
    description: "Helping young players learn golf and life skills.",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b"
  },
  {
    name: "Green Fairways Foundation",
    description: "Supporting sustainable golf spaces and community coaching.",
    image: "https://images.unsplash.com/photo-1517602302552-471fe67acf66"
  }
];

const seed = async () => {
  await connectDatabase();

  await Charity.deleteMany();
  await Charity.insertMany(charities);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: "Platform Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        subscriptionStatus: true,
        subscriptionType: "yearly"
      });
    }
  }

  console.log("Seed complete");
  process.exit(0);
};

seed();
