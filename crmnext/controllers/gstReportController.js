import Sale from "../models/Sale"; // or your current source

export const getGstReportFromSales = async (req, res) => {
  const { role } = req.query;

  try {
    const sales = await Sale.find(role ? { sellerRole: role } : {});

    console.log(sales, "sales report data");

    const results = sales.map((sale) => {
      const gstAmount = (sale.totalAmount * sale.gstRate) / 100;

      return {
        orderId: sale.orderId,
        transactionId: sale.transactionId,
        sellerName: sale.sellerName,
        sellerRole: sale.sellerRole,
        amount: sale.totalAmount,
        gstRate: sale.gstRate || 0,
        gstAmount: parseFloat(gstAmount.toFixed(2)),
        platform: sale.platform,
        createdAt: sale.createdAt,
        invoiceUrl: sale.invoiceUrl || null,
      };
    });

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to load GST Report" });
  }
};
