// pages/api/beneficiaries/[id].js

import nextConnect from "next-connect";
import upload from "../../../middleware/upload";

import {
  getBeneficiaryById,
  updateBeneficiary,
  deleteBeneficiary,
} from "../../../controllers/beneficiaryController";

export const config = {
  api: {
    bodyParser: false,
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

// Accept file uploads for update
apiRoute.use(
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadhaarDocumentUrl", maxCount: 1 },
  ])
);

apiRoute.get(getBeneficiaryById);
apiRoute.put(updateBeneficiary);
apiRoute.delete(deleteBeneficiary);

export default apiRoute;
