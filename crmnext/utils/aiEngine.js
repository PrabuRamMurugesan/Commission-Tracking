const regression = require("regression");

function analyzeTrends(transactions) {
  // Extract sales data for AI analysis
  let dataPoints = transactions.map((txn, index) => [index, txn.amount]);

  if (dataPoints.length < 2) {
    return { message: "Insufficient data for AI trend analysis" };
  }

  // Apply regression model
  const result = regression.linear(dataPoints);
  const trendLine = result.equation; // Linear trend equation

  return {
    forecastEquation: `y = ${trendLine[0]}x + ${trendLine[1]}`,
    predictedNextMonthSales: trendLine[0] * (dataPoints.length + 1) + trendLine[1],
  };
}

module.exports = { analyzeTrends };
