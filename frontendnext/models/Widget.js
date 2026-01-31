import mongoose from "mongoose";

const WidgetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  count: { type: Number, required: true },
  bgColor: { type: String, required: true },
  icon: { type: String, required: true }
});

// Check if the model already exists before defining it again
const Widget = mongoose.models.Widget || mongoose.model("Widget", WidgetSchema);

export default Widget;
