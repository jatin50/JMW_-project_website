import mongoose from "mongoose";
const AddressSchema = new mongoose.Schema(
  {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    country: { type: String, required: true },
    district: { type: String, required: true },
  },
  { timestamps: true }
);

export const Address = mongoose.model("Address", AddressSchema);
