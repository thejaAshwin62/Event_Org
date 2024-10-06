import mongoose from "mongoose";
import User from "../models/UserSchema.js";
import { StatusCodes } from "http-status-codes";
import Booking from "../models/BookingSchema.js";

// Backend: getUserBookings.js
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid user ID" });
    }

    // Find user and populate bookings with event details
    const user = await User.findById(userId).populate({
      path: "bookings",
      populate: {
        path: "eventId",
        model: "Event",
        select: "name image Payment Catogory companyName location details date", // Select required fields
      },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }

    if (user.bookings.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No bookings found for this user" });
    }

    // Format the response to include all event details
    const bookingsWithEventDetails = user.bookings.map((booking) => ({
      bookedAt: booking.bookedAt,
      eventName: booking.eventId.name,
      eventImage: booking.eventId.image,
      Payment: booking.eventId.Payment,
      location: booking.eventId.location,
      Catogory: booking.eventId.Catogory,
      image: booking.eventId.image,
      companyName: booking.eventId.companyName,
      isApproved: booking.eventId.isApproved,
      details: booking.eventId.details,
      date: booking.eventId.date,
      booked: booking.eventId.booked,
    }));

    res.status(StatusCodes.OK).json({
      msg: "User bookings retrieved",
      bookings: bookingsWithEventDetails,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server Error" });
  }
};
