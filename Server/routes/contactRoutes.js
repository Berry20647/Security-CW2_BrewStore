const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const auth = require("../middleware/authMiddleware");
const { verifyDataIntegrity } = require("../middleware/integrityCheck");

router.post("/", verifyDataIntegrity, contactController.submitContact);
router.get("/", auth, contactController.getAllContacts); // Optional: restrict to admin only
router.delete("/:id", auth, contactController.deleteContact); // Add delete route

module.exports = router;
