import GstFilingLog from "../models/GstFilingLog";

export const createGstLog = async (req, res) => {
  try {
    const log = new GstFilingLog(req.body);
    await log.save();
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getUserGstLogs = async (req, res) => {
  try {
    const { userId } = req.query;
    const logs = await GstFilingLog.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateGstLog = async (req, res) => {
  try {
    const { id } = req.query;
    const update = await GstFilingLog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, data: update });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
