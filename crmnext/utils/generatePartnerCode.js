// utils/generatePartnerCode.js
export function generateLocationPartnerCode({
  role,
  stateCode,
  cityCode,
  createdAt,
  count,
}) {
  const rolePrefix =
    {
      agent: "AGT",
      vendor: "VND",
      franchisee: "FRA",
      "vendor-employee": "VEM",
      "franchisee-employee": "FEM",
    }[role] || "XX";

  const mmYY = createdAt
    .toLocaleDateString("en-IN", {
      month: "2-digit",
      year: "2-digit",
    })
    .replace("/", "");

  const serial = String(count + 1).padStart(3, "0");

  return `${rolePrefix}${stateCode}${cityCode}${mmYY}${serial}`;
}
