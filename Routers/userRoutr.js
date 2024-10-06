import { Router } from "express";
const router = Router();
import {
  getCurrentUser,
  getApplicationStats,
  updateUser,
  updateEventApproval,
  
} from "../Controllers/userController.js";
import { getUserBookings } from "../Controllers/BookedEvent.js";
import { getStats } from "../Controllers/statsContoller.js";


router.get("/current-user", getCurrentUser);
router.get("/admin/app-stats", [getApplicationStats, getStats]);
router.patch("/update-user", updateUser)
router.post("/:id/update-status", updateEventApproval);

//view-booked ships
router.get("/booked-details/:userId", getUserBookings);

export default router;
