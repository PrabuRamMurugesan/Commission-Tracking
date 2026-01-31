// stub for your payment provider integration
export default {
  async refundEscrow(escrowRef, amount) {
    // call Stripe/Razorpay/SBI API…
    return { success: true, refundId: "RFND-12345" };
  },
};
