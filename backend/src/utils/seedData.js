import bootstrapDefaultCharities from "../seed/bootstrapCharities.js";

const seedData = async () => {
  await bootstrapDefaultCharities();
};

export default seedData;
