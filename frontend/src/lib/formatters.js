export const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount);

export const formatDate = (value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const getSubscriptionLabel = (user) =>
  user?.subscriptionStatus ? `${user.subscriptionType} active` : "inactive";
