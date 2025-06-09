export const resolveReferral = async (referralId) => {
  console.log("🔍 resolveReferral CALLED with:", referralId);

  const roleStatus = {
    agentId: undefined,
    vendorId: undefined,
    cbvId: undefined,
  };

  if (!referralId) return roleStatus;

  try {
    if (await Agent.exists({ _id: referralId })) {
      console.log("✅ Referral is Agent");
      return { ...roleStatus, agentId: referralId };
    }
    if (await Vendor.exists({ _id: referralId })) {
      console.log("✅ Referral is Vendor");
      return { ...roleStatus, vendorId: referralId };
    }
  } catch (err) {
    console.error("❌ Referral resolution failed:", err.message);
  }

  return roleStatus;
};
