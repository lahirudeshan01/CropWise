const express = require("express");
const router = express.Router();
const Farmers = require("../models/farmers");
const upload = require("../middleware/upload"); // Import multer middleware

// Test route
router.get("/test", (req, res) => res.send("routes working..."));

// POST method - Add a new farmer with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { farmerId, Character, verity, quantity, price, address, location } = req.body;
    
    // Construct farmer data
    const newFarmer = new Farmers({
      farmerId,
      Character,
      verity,
      quantity,
      price,
      address,
      location,
      image: req.file ? req.file.filename : null, // Save image filename if uploaded
    });

    await newFarmer.save();
    res.json({ msg: "Harvest added successfully", data: newFarmer });
  } catch (error) {
    console.error("Error adding harvest:", error);
    res.status(400).json({ msg: "Harvest add failed" });
  }
});

// GET method - Fetch all farmers
router.get("/", async (req, res) => {
  try {
    const farmers = await Farmers.find();
    res.json(farmers);
  } catch (error) {
    res.status(404).json({ msg: "No Farmers found" });
  }
});

// GET by ID - Fetch a single farmer by ID
router.get("/:id", async (req, res) => {
  try {
    const farmer = await Farmers.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ msg: "Farmer not found" });
    }
    res.json(farmer);
  } catch (error) {
    res.status(400).json({ msg: "Invalid Farmer ID" });
  }
});

// UPDATE by ID - Update a farmer
router.put("/:id", async (req, res) => {
  try {
    await Farmers.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Update successful" });
  } catch (error) {
    res.status(400).json({ msg: "Update failed" });
  }
});

// DELETE by ID - Remove a farmer
router.delete("/:id", async (req, res) => {
  try {
    const farmer = await Farmers.findByIdAndDelete(req.params.id);
    if (!farmer) {
      return res.status(404).json({ msg: "Farmer not found" });
    }
    res.json({ msg: "Farmer deleted successfully" });
  } catch (error) {
    res.status(400).json({ msg: "Delete failed" });
  }
});

module.exports = router;
