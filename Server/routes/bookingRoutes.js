const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, bookingController.createBooking);
router.get("/my", auth, bookingController.getUserBookings);
router.get("/", auth, bookingController.getAllBookings); // Optional: protect with admin check
router.patch("/:id/status", auth, bookingController.updateBookingStatus);

module.exports = router;
