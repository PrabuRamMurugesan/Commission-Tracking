// utils/logActivity.js
import dbConnect from "../lib/mongodb";
// import ActivityLog from "@/models/ActivityLog";

export const logActivity = async ({ userId, role, action, meta = {} }) => {
  await dbConnect();

//   const newLog = new ActivityLog({
//     userId,
//     role,
//     action,
//     meta,
//     timestamp: new Date(),
//   });

//   await newLog.save();

  console.log("📌 Activity Logged:", {
    userId,
    role,
    action,
    meta,
  });
};
