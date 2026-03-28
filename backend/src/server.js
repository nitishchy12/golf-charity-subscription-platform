import dotenv from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/db.js";
import seedData from "./utils/seedData.js";

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    await seedData();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server bootstrap failed", error.message);
    process.exit(1);
  }
};

startServer();
