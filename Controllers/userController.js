import User from "../models/UserSchema.js";
import mongoose from "mongoose";
import Event from "../models/EventModel.js";
import Booking from "../models/BookingSchema.js";
import { StatusCodes } from "http-status-codes";

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const getApplicationStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(StatusCodes.FORBIDDEN).json({ msg: "Unauthorized" });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    // Fetch events data
    const eventsData = await Event.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fetch user logins data
    const userLoginsData = await User.aggregate([
      {
        $lookup: {
          from: "logins",
          localField: "_id",
          foreignField: "userId",
          as: "loginsDetails",
        },
      },
      { $unwind: "$loginsDetails" },
      { $unwind: "$loginsDetails.createdAt" },
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$loginsDetails.createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fetch bookings data
    const bookingsData = await Booking.aggregate([
      {
        $match: {
          bookedAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$bookedAt" } },
          totalBookings: { $sum: 1 },
          approvedBookings: {
            $sum: {
              $cond: [{ $eq: ["$isApproved", "approved"] }, 1, 0],
            },
          },
          pendingBookings: {
            $sum: {
              $cond: [{ $eq: ["$isApproved", "pending"] }, 1, 0],
            },
          },
          canceledBookings: {
            $sum: {
              $cond: [{ $eq: ["$isApproved", "canceled"] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const users = await User.countDocuments();
    const events = await Event.countDocuments();

    const bookings = await Booking.find()
      .populate("userId", "name")
      .populate(
        "eventId",
        "name Payment isApproved Catogory companyName location details date"
      )
      .exec();

    const bookedEvents = bookings.map((booking) => ({
      EventName: booking.eventId ? booking.eventId.name : "Unknown event",
      userName: booking.userId ? booking.userId.name : "Unknown User",
      Payment: booking.eventId ? booking.eventId.Payment : "Unknown Price",
      location: booking.eventId ? booking.eventId.location : "Unknown location",
      Catogory: booking.eventId ? booking.eventId.Catogory : "Unknown Features",
      companyName: booking.eventId
        ? booking.eventId.companyName
        : "Unknown companyName",
      isApproved: booking.eventId
        ? booking.eventId.isApproved
        : "Unknown isApproved",
      isApproved: booking.eventId
        ? booking.eventId.isApproved
        : "Unknown Status",
      bookingDate: formatDate(booking.bookingDate),
      date: booking.eventId ? formatDate(booking.eventId.date) : "Unknown date",
      details: booking.eventId ? booking.eventId.details : "unknown details",
      bookingId: booking._id,
    }));

    // Function to format events data
    const formatEventsData = (data) => {
      return data.map((item) => ({
        date: item._id,
        count: item.count,
      }));
    };

    // Function to format user logins data
    const formatUserLoginsData = (data) => {
      return data.map((item) => ({
        date: item._id,
        count: item.count,
      }));
    };

    // Function to format bookings data
    const formatBookingsData = (data) => {
      return data.map((item) => ({
        date: item._id,
        totalBookings: item.totalBookings,
        approvedBookings: item.approvedBookings,
        pendingBookings: item.pendingBookings,
        canceledBookings: item.canceledBookings,
      }));
    };

    res.status(StatusCodes.OK).json({
      users,
      events,
      bookedEvents,
      eventsData: formatEventsData(eventsData),
      userLoginsData: formatUserLoginsData(userLoginsData),
      bookingsData: formatBookingsData(bookingsData),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};


export const updateUser = async (req, res) => {
  const newUser = { ...req.body };
  delete newUser.password;
  res.status(StatusCodes.OK).json({ msg: "update user" });
};
export const updateEventApproval = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Event ID:", id); // Log the ID to check
    const { status } = req.body;

    if (!["approved", "cancelled", "pending"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    event.isApproved = status;
    await event.save();

    res.status(200).json({ msg: `Event ${status}`, event });
  } catch (error) {
    console.error("Error:", error); // Log the error to debug
    res.status(500).json({ msg: "Server Error" });
  }
};

export const bookEventForUser = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const { bookingDate } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(eventId)
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid ID" });
    }

    const event = await Event.findById(eventId);
    if (!event)
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "event not found" });
    if (event.booked)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "event is already booked" });

    // Create a booking entry with status pending
    const booking = new Booking({ userId, eventId, bookingDate });
    await booking.save();

    // Update event status to pending and save
    event.isApproved = "pending";
    await event.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { bookings: booking._id } },
      { new: true }
    );

    res.status(StatusCodes.OK).json({
      msg: "Booking request submitted successfully",
      event: { ...event.toObject(), bookingDate },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server Error" });
  }
};
