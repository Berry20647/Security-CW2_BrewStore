const express = require("express");
const router = express.Router();
const coffeeController = require("../controllers/coffeeController");
const auth = require("../middleware/authMiddleware");
const { integrityCheck } = require("../middleware/integrityCheck");
const upload = require("../middleware/uploadMiddleware");

router.get("/", coffeeController.getAllcoffees);
router.get("/:id", coffeeController.getcoffeeById);
router.post("/", auth, integrityCheck, upload.single("image"), coffeeController.createcoffee);
router.put("/:id", auth, integrityCheck, upload.single("image"), coffeeController.updatecoffee);
router.delete("/:id", auth, coffeeController.deletecoffee);
router.get("/name/:name", coffeeController.getcoffeeByName);

module.exports = router;
