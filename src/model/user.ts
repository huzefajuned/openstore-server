import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    phoneNumber: { type: String, required: true },
    profile: {
      type: String,
    },
    panCard: { type: String },
    adhaarCard: { type: String },
    emailID: { type: String },
    shopName: { type: String },
    sellerName: { type: String },
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
export default user;
