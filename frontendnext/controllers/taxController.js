import TaxRate from "../models/TaxRate";

export const createTaxRate = async (req, res) => {
  try {
    const tax = new TaxRate(req.body);
    await tax.save();
    res.status(201).json({ success: true, data: tax });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getTaxRates = async (req, res) => {
  try {
    const taxRates = await TaxRate.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: taxRates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTaxRate = async (req, res) => {
  try {
    const { id } = req.query;
    const updated = await TaxRate.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteTaxRate = async (req, res) => {
  try {
    const { id } = req.query;
    await TaxRate.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
