// controllers/Territory-HeadReport.js
import TerritoryHeadReport from "../../models/Territory-HeadReport";

export const getAllTerritoryHeads = async () => {
  const territories = await TerritoryHeadReport.find(
    {},
    {
      name: 1,
      email: 1,
      phone: 1,
      whatsappNumber: 1,
      designation: 1,
      zone: 1,
      stateCode: 1,
      cityCode: 1,
      platform: 1,
      franchiseeId: 1,
      businessPartnerCode: 1,
      commissionRates: 1,
      accountStatus: 1,
      createdAt: 1,
      kycStatus: 1,
      lastActive: 1,
      comments: 1,
    }
  ).lean();

  return territories;
};
