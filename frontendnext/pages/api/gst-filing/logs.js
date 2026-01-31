import dbConnect from "../../../lib/mongodb";
import {
  createGstLog,
  getUserGstLogs,
  updateGstLog,
} from "../../../controllers/gstFilingController";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  return getUserGstLogs(req, res);
});

router.post(async (req, res) => {
  await dbConnect();
  return createGstLog(req, res);
});

router.put(async (req, res) => {
  await dbConnect();
  return updateGstLog(req, res);
});

export default router.handler();
