import { Router } from "express";
import { validIdParam } from "../middleware/validationMiddleware.js";
import {
  createEvents,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getOneEvent,
} from "../Controllers/EventControllers.js";
import { approveBooking, deleteBooking } from "../Controllers/eventApproval.js";
import { bookEventForUser } from "../Controllers/userController.js"; // Updated import
import { isAdmin } from "../middleware/authMiddleware.js";
//ship
const router = Router();

// Ship routes
  router.route("/").post(isAdmin, createEvents).get(getAllEvents);

router
  .route("/:id")
  .get(validIdParam, getOneEvent)
  .patch(validIdParam, updateEvent)
  .delete(validIdParam, deleteEvent);

// Book a ship
router.post("/:eventId/book/:userId", bookEventForUser);

router.patch("/bookings/:bookingId/status", isAdmin, approveBooking);

router.delete("/bookings/:bookingId", deleteBooking);

export default router;
