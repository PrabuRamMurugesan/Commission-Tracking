import ExcelJS from "exceljs";

export const exportSalesDataToExcel = async (
  data,
  filename = "Sales_Report"
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sales Report");

  // Header Row
  worksheet.columns = [
    { header: "Date / Time", key: "date", width: 25 },
    { header: "Order ID", key: "orderId", width: 20 },
    { header: "Transaction ID", key: "transactionId", width: 25 },
    { header: "Platform", key: "platform", width: 15 },
    { header: "Products", key: "products", width: 40 },
    { header: "Seller Name", key: "sellerName", width: 20 },
    { header: "Seller Role", key: "sellerRole", width: 15 },
    { header: "Buyer", key: "buyer", width: 25 },
    { header: "Payment Status", key: "paymentStatus", width: 15 },
    { header: "Order Status", key: "orderStatus", width: 15 },
    { header: "Payment Method", key: "paymentMethod", width: 20 },
    { header: "Final Amount (₹)", key: "finalAmount", width: 18 },
    { header: "Commission %", key: "commissionPercent", width: 15 },
    { header: "Payout Status", key: "payoutStatus", width: 15 },
  ];

  // Format and Add Data Rows
  data.forEach((item) => {
    const productList = item.products
      ?.map((p) => `${p.title} (Qty: ${p.quantity})`)
      .join(", ");

    worksheet.addRow({
      date: new Date(item.createdAt).toLocaleString(),
      orderId: item.orderId,
      transactionId: item.transactionId || "-",
      platform: item.platform,
      products: productList,
      sellerName: item.seller?.name || "-",
      sellerRole: item.sellerRole,
      buyer: `${item.buyer?.name || "-"} / ${maskPhone(item.buyer?.phone)}`,
      paymentStatus: item.paymentStatus,
      orderStatus: item.orderStatus,
      paymentMethod: item.paymentMethod,
      finalAmount: item.finalAmount?.toFixed(2),
      commissionPercent: item.commissionPercent || "0",
      payoutStatus: item.payoutStatus,
    });
  });

  // Formatting: Currency & Header
  worksheet.getRow(1).font = { bold: true };
  worksheet.columns.forEach((col) => {
    col.alignment = { vertical: "middle", horizontal: "left" };
  });

  const blob = await workbook.xlsx.writeBuffer();
  const url = window.URL.createObjectURL(new Blob([blob]));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filename}.xlsx`;
  anchor.click();
  window.URL.revokeObjectURL(url);
};

// Helper
const maskPhone = (phone) => {
  if (!phone) return "-";
  return phone.slice(0, 2) + "****" + phone.slice(-2);
};
