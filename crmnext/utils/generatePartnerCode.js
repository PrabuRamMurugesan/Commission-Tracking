// utils/generatePartnerCode.js
import HealthcarePartner from "../models/HealthcarePartner";

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
export async function generatePartnerCode(state, city) {
  const prefix = "HP";

  const stateCode = state ? state.substring(0, 2).toUpperCase() : "NA";
  const cityCode = city ? city.substring(0, 3).toUpperCase() : "CTY";

  const date = new Date();
  const dateCode = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;

  const count = await HealthcarePartner.countDocuments();

  const serial = (count + 1).toString().padStart(5, "0");

  return `${prefix}-${stateCode}-${cityCode}-${dateCode}-${serial}`;
}