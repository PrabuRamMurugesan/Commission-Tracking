import VendorInventory from "../../models/VendorInventory";

export default async function syncService(validRows, vendorId) {
  for (let row of validRows) {
    await VendorInventory.findOneAndUpdate(
      { vendorId, masterProductId: row.masterProductId },
      {
        price: row.price,
        stock: row.stock,
        discount: row.discount || 0,
        marginAdjustedPrice: row.adjustedPrice,
        commission: row.commission || 0,
        status: "active",
        visibility: true,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );
  }
}
