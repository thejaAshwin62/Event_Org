import mongoose from "mongoose";

const Booking = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
    bookingDate: {
      type: Date,
    },
    isApproved: {
      type: String, // or another type depending on your needs
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", Booking);
