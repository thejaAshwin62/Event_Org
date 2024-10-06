import mongoose from "mongoose";

const Event = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    Payment: {
      type: Number,
      required: true,
    },
    Catogory: {
      type: String,
      required: true,
    },
    isApproved: {
      type: String,
      enum: ["pending", "approved", "rejected", "avaiable"],
      default: "avaiable",
    },
    location: {
      type: String,
      required: true,
    },
    details: {
      type: String, // Assuming 'details' is event description or details
      required: false,
    },
    date: {
      type: Date,
      required: false,
    },
    booked: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
     
    },
    companyName: {
      type: String,
      required: "true",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ship",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", Event);
