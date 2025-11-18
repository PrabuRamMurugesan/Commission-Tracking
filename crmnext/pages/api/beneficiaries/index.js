// pages/api/beneficiaries/index.js

import nextConnect from "next-connect";
import upload from "../../../middleware/upload";
import {
  createBeneficiary,
  getBeneficiaries,
} from "../../../controllers/beneficiaryController";

export const config = {
  api: {
    bodyParser: false, // required for multer + FormData
  },
};

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error("Beneficiary API Error:", error);
    res
      .status(500)
      .json({
        success: false,
        error: "Internal Server Error: " + error.message,
      });
  },

  onNoMatch(req, res) {
    res
      .status(405)
      .json({ success: false, error: `Method ${req.method} Not Allowed` });
  },
});

// 1) Attach multer as middleware for this route
const uploadMiddleware = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "aadhaarDocumentUrl", maxCount: 1 },
]);

apiRoute.use(uploadMiddleware);

// 2) Wire handlers
apiRoute.get(getBeneficiaries);
apiRoute.post(createBeneficiary);

export default apiRoute;
