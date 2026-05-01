// Utility function to format currency in Indian Rupees (INR)
// Can be easily modified to support other currencies
export const formatCurrency = (num) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(num);
};