const mongoose = require("mongoose");

const AITrafficLoadBalancingSchema = new mongoose.Schema({
  balanceId: { type: String, required: true, unique: true },
  serverRegion: { type: String, required: true }, // Region of the server (e.g., US-East, EU-West)
  currentTrafficLoad: { type: Number, required: true }, // Percentage of server load
  congestionDetected: { type: Boolean, default: false }, // AI detects congestion
  reroutedTraffic: { type: Number, default: 0 }, // AI adjusts traffic dynamically
  geoRoutingEnabled: { type: Boolean, default: true }, // AI directs traffic based on user location
  latencyMetrics: { type: Number, required: true }, // Response time in milliseconds
  recommendedServerAdjustments: { type: String, required: false }, // AI-suggested server scaling/redistribution
  networkHealthStatus: { type: String, enum: ["Optimal", "Moderate", "Critical"], default: "Optimal" },
  lastChecked: { type: Date, default: Date.now },
}, { timestamps: true });

const AITrafficLoadBalancing = mongoose.model("AITrafficLoadBalancing", AITrafficLoadBalancingSchema);
module.exports = AITrafficLoadBalancing;
