// controllers/agentController.js
import Agent from "../../models/Agent";

export const getAllAgents = async () => {
  const agents = await Agent.find(
    {},
    {
      name: 1,
      email: 1,
      phone: 1,
      whatsappNumber: 1,
      designation: 1,
      zone: 1,
      accountStatus: 1,
      createdAt: 1,
      platform: 1,
      franchiseeId: 1,
      businessPartnerCode: 1,
      commissionRates: 1,
      kycStatus: 1,
      lastActive: 1,
      comments: 1,
    }
  ).lean();

  return agents;
};
