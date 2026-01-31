import Agent from "../../models/Agent/Agent";
import Vendor from "../../models/Vendor/Vendor";
import Customer from "../../models/Customer";
import {Transaction} from "../../models/Transaction";
import Franchise from "../../models/Franchise/Francise";

/**
 * Filters customers based on the role + ID
 */
export async function getCustomersByRole(user) {
  const { _id, role } = user;
  let customers = [];

  console.log(`🔍 getCustomersByRole: role=${role}, _id=${_id}`);

  if (!role || !_id) {
    console.warn("⚠️ Missing role or user ID");
    return [];
  }

  if (role === "agent") {
    const vendors = await Vendor.find({ agentId: _id });
    const vendorIds = vendors.map((v) => v._id);

    customers = await Customer.find({
      $or: [{ agentId: _id }, { vendorId: { $in: vendorIds } }],
    });
  } else if (role === "franchise") {
    customers = await Customer.find({ franchiseId: _id });
  } else if (role === "vendor") {
    customers = await Customer.find({ vendorId: _id });
  } else if (role === "territory") {
    customers = await Customer.find({ territoryId: _id });
  } else if (role === "cbv") {
    customers = await Customer.find({ cbvId: _id });
  } else if (role === "franchisee" || role === "territory-head") {
    const agents = await Agent.find({ [`${role}Id`]: _id });
    const agentIds = agents.map((a) => a._id);

    const vendors = await Vendor.find({ [`${role}Id`]: _id });
    const vendorIds = vendors.map((v) => v._id);

    customers = await Customer.find({
      $or: [{ agentId: { $in: agentIds } }, { vendorId: { $in: vendorIds } }],
    });
  } else if (role === "admin") {
    customers = await Customer.find(); // show all
  }

  // Add enrichment
  const enrichedCustomers = await Promise.all(
    customers.map(async (cust) => {
      const transactions = await Transaction.find({ customerId: cust._id });

      return {
        _id: cust._id,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        referralType: cust.agentId
          ? "agent"
          : cust.vendorId
          ? "vendor"
          : cust.franchiseId
          ? "franchise"
          : cust.cbvId
          ? "cbv"
          : cust.territoryId
          ? "territory"
          : "direct",
        referralId:
          cust.agentId?._id ||
          cust.franchiseId?._id ||
          cust.territoryId?._id ||
          cust.vendorId?._id ||
          cust.cbvId?._id ||
          null,
        referralName:
          cust.agentId?.name ||
          cust.franchiseId?.name ||
          cust.territoryId?.name ||
          cust.vendorId?.name ||
          cust.cbvId?.name ||
          "Direct",
        transactions,
        totalTransactions: transactions.length,
      };
    })
  );

  console.log(
    `✅ getCustomersByRole returning ${enrichedCustomers.length} customers`
  );
  return enrichedCustomers;
}
