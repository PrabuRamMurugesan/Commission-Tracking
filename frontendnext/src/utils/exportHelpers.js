// src/utils/exportHelpers.js
import { saveAs } from "file-saver";

export const exportAgentsToCSV = (agents) => {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Platform",
    "Zone",
    "Status",
    "Total Customers",
    "Total Transactions",
    "Commission Earned",
    "Commission Pending",
    "Joined",
  ];

  const rows = agents.map((agent) => [
    agent.name,
    agent.email,
    agent.phone,
    agent.platform,
    agent.zone || "-",
    agent.accountStatus,
    agent.totalCustomers || 0,
    agent.totalTransactions || 0,
    agent.commissionEarned || 0,
    agent.commissionPending || 0,
    new Date(agent.joinedDate || agent.createdAt).toLocaleDateString(),
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "agents_export.csv");
};
