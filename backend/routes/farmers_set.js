const express = require("express");
const router = express.Router();
const Farmers = require("../models/farmers");
const upload = require("../middleware/upload"); // Import multer middleware
const auth = require("../middleware/auth"); // Import auth middleware
const fs = require('fs');
const path = require('path');

// Public: Get all farmers' harvest listings (for buyers)
router.get("/", async (req, res) => {
  try {
    const farmers = await Farmers.find({}).populate('userId', 'firstName lastName farmName');
    res.json(farmers);
  } catch (error) {
    res.status(404).json({ msg: "No Farmers found" });
  }
});

// This gets ONLY the listings for the logged-in farmer
router.get("/my-listings", auth, async (req, res) => {
  try {
    const farmers = await Farmers.find({ userId: req.user._id });
    res.json(farmers);
  } catch (error) {
    res.status(404).json({ msg: "No Farmers found" });
  }
});

// Protect all routes below this line
router.use(auth);

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    // Find the existing farmer to handle potential image replacement
    const existingFarmer = await Farmers.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!existingFarmer) {
      return res.status(404).json({ msg: "Farmer not found" });
    }

    // Prepare update data
    const updateData = {
      farmerId: req.body.farmerId,
      Character: req.body.Character,
      verity: req.body.verity,
      quantity: parseFloat(req.body.quantity) || existingFarmer.quantity, // Convert to number
      price: req.body.price,
      address: req.body.address,
      location: req.body.location
    };

    // Handle image update
    if (req.file) {
      // If there was a previous image, delete it
      if (existingFarmer.image) {
        const oldImagePath = path.join(__dirname, '../uploads', existingFarmer.image);
        // Check if file exists before trying to delete
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      // Add new image filename to update data
      updateData.image = req.file.filename;
    }

    // Update the farmer
    const updatedFarmer = await Farmers.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );

    res.json({ 
      msg: "Update successful", 
      data: updatedFarmer 
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ msg: "Update failed", error: error.message });
  }
});

// Test route
router.get("/test", (req, res) => res.send("routes working..."));

// POST method - Add a new farmer with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { farmerId, Character, verity, quantity, price, address, location } = req.body;
    
    // Convert quantity to number
    const numericQuantity = parseFloat(quantity) || 0;
    
    // Construct farmer data
    const newFarmer = new Farmers({
      userId: req.user._id, // Add user ID
      farmerId,
      Character,
      verity,
      quantity: numericQuantity, // Save as number
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

// GET by ID - Fetch a single farmer by ID (for current user)
router.get("/:id", async (req, res) => {
  try {
    const farmer = await Farmers.findOne({ _id: req.params.id, userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ msg: "Farmer not found" });
    }
    res.json(farmer);
  } catch (error) {
    res.status(400).json({ msg: "Invalid Farmer ID" });
  }
});

// UPDATE by ID - Update a farmer (for current user)
router.put("/:id", async (req, res) => {
  try {
    const updatedFarmer = await Farmers.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id }, 
      req.body,
      { new: true }
    );
    if (!updatedFarmer) {
      return res.status(404).json({ msg: "Farmer not found" });
    }
    res.json({ msg: "Update successful", data: updatedFarmer });
  } catch (error) {
    res.status(400).json({ msg: "Update failed" });
  }
});

// DELETE by ID - Remove a farmer (for current user)
router.delete("/:id", async (req, res) => {
  try {
    const farmer = await Farmers.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ msg: "Farmer not found" });
    }
    res.json({ msg: "Farmer deleted successfully" });
  } catch (error) {
    res.status(400).json({ msg: "Delete failed" });
  }
});

module.exports = router;
