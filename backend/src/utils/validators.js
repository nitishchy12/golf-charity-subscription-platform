import ApiError from "./apiError.js";

export const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const validatePassword = (password) => password && password.length >= 6;

export const validateScore = (score) => Number.isInteger(score) && score >= 1 && score <= 45;

export const validatePercentage = (percentage) =>
  Number.isFinite(percentage) && percentage >= 10 && percentage <= 100;

export const assertRequiredFields = (payload, fields) => {
  const missing = fields.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === "");
  if (missing.length) {
    throw new ApiError(400, `Missing required fields: ${missing.join(", ")}`);
  }
};
