const express = require("express");
const Gig = require("../models/Gig");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/gigs
// @desc    Get all open gigs with search
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = { status: "open" };

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const gigs = await Gig.find(query)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: gigs.length,
      gigs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/gigs/my-gigs
// @desc    Get user's posted gigs
// @access  Private
router.get("/my-gigs", protect, async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: gigs.length,
      gigs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/gigs/:id
// @desc    Get single gig
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate(
      "ownerId",
      "name email"
    );

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    res.json({
      success: true,
      gig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/gigs
// @desc    Create a new gig
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id,
    });

    const populatedGig = await Gig.findById(gig._id).populate(
      "ownerId",
      "name email"
    );

    res.status(201).json({
      success: true,
      gig: populatedGig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/gigs/:id
// @desc    Update a gig
// @access  Private (Owner only)
router.put("/:id", protect, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    // Check ownership
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this gig",
      });
    }

    const { title, description, budget } = req.body;

    gig.title = title || gig.title;
    gig.description = description || gig.description;
    gig.budget = budget || gig.budget;

    await gig.save();

    res.json({
      success: true,
      gig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/gigs/:id
// @desc    Delete a gig
// @access  Private (Owner only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    // Check ownership
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this gig",
      });
    }

    await gig.deleteOne();

    res.json({
      success: true,
      message: "Gig deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
