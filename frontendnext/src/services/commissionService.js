const calculateCommission = async (sale) => {
    const commission = {};
  
    // Dynamic rates based on the sale type and involved parties
    commission.agentCommission = sale.saleAmount * 0.05;  // 5% to agent
    commission.franchiseeCommission = sale.saleAmount * 0.02;  // 2% to franchisee
    commission.territoryHeadCommission = sale.saleAmount * 0.01;  // 1% to territory head
  
    if (sale.customerVendorId) {
      commission.customerVendorCommission = sale.saleAmount * 0.03;
    } else {
      commission.customerVendorCommission = 0;
    }
  
    if (sale.referredBy) {
      commission.referralBonus = sale.saleAmount * 0.02;
    } else {
      commission.referralBonus = 0;
    }
  
    return commission;
  };
  
  const createCommissionRecord = async (sale) => {
    try {
      const commissions = await calculateCommission(sale);
  
      const newCommission = {
        saleId: sale._id,
        agentId: sale.agentId,
        franchiseeId: sale.franchiseeId,
        territoryHeadId: sale.territoryHeadId,
        vendorId: sale.vendorId,
        customerVendorId: sale.customerVendorId,
        referralId: sale.referredBy,
  
        agentCommission: commissions.agentCommission,
        franchiseeCommission: commissions.franchiseeCommission,
        territoryHeadCommission: commissions.territoryHeadCommission,
        customerVendorCommission: commissions.customerVendorCommission,
        referralBonus: commissions.referralBonus,
  
        status: 'Pending'
      };
  
      console.log('Commission calculated successfully:', newCommission);
      return newCommission;
    } catch (error) {
      console.error('Error calculating commission:', error);
      throw error;
    }
  };
  
  module.exports = { calculateCommission, createCommissionRecord };
  