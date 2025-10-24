export function getMinMarginPrice(category, MRP) {
  const marginByCategory = {
    grocery: 0.1, // 10%
    staples: 0.1,
    cosmetics: 0.05,
  };

  const margin = marginByCategory[category?.toLowerCase()] || 0;
  return Math.round(MRP * (1 - margin));
}
