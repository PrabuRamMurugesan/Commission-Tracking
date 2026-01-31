// utils/dateHelpers.js

/**
 * Returns the start date based on the given period.
 * Supports daily, weekly, monthly, and yearly calculations.
 * 
 * @param {string} period - The time period ('daily', 'weekly', 'monthly', 'yearly')
 * @returns {Date} The calculated start date
 */
exports.getStartDate = (period) => {
  const now = new Date();  // Get current date and time
  now.setHours(0, 0, 0, 0);  // Reset time to the start of the day

  switch (period.toLowerCase()) {
    case 'daily':
      return now;  // Start of the current day
    case 'weekly':
      return new Date(now.setDate(now.getDate() - 7));  // 7 days ago
    case 'monthly':
      return new Date(now.setMonth(now.getMonth() - 1));  // 1 month ago
    case 'yearly':
      return new Date(now.setFullYear(now.getFullYear() - 1));  // 1 year ago
    default:
      throw new Error(`Invalid period: ${period}. Use 'daily', 'weekly', 'monthly', or 'yearly'.`);
  }
};
