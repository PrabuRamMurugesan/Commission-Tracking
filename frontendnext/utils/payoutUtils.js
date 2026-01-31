const Payout = require("../models/Payout");

async function processPayouts() {
  const pendingPayouts = await Payout.find({ status: "approved" });

  if (!pendingPayouts.length) {
    return { message: "No approved payouts to process." };
  }

  for (let payout of pendingPayouts) {
    payout.status = "completed";
    payout.processedAt = new Date();
    await payout.save();
  }

  return pendingPayouts;
}

module.exports = { processPayouts };
