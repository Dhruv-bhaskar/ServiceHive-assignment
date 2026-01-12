const express = require("express");
const mongoose = require("mongoose");
const Bid = require("../models/Bid");
const Gig = require("../models/Gig");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/bids
// @desc    Submit a bid for a gig
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    if (gig.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This gig is no longer accepting bids",
      });
    }

    // Prevent owner from bidding on their own gig
    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot bid on your own gig",
      });
    }

    // Create bid
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price,
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate("freelancerId", "name email")
      .populate("gigId", "title");

    res.status(201).json({
      success: true,
      bid: populatedBid,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a bid for this gig",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/bids/:gigId
// @desc    Get all bids for a specific gig
// @access  Private (Owner only)
router.get("/:gigId", protect, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    // Only gig owner can see bids
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view bids for this gig",
      });
    }

    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bids.length,
      bids,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/bids/my-bids/all
// @desc    Get all bids submitted by the user
// @access  Private
router.get("/my-bids/all", protect, async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate("gigId", "title description budget status")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bids.length,
      bids,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PATCH /api/bids/:bidId/hire
// @desc    Hire a freelancer (CRITICAL ATOMIC OPERATION WITH TRANSACTION)
// @access  Private (Gig Owner only)
router.patch("/:bidId/hire", protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the bid with session
    const bid = await Bid.findById(req.params.bidId)
      .populate("gigId")
      .session(session);

    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Bid not found",
      });
    }

    const gig = bid.gigId;

    // Verify ownership
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Not authorized to hire for this gig",
      });
    }

    // Check if gig is still open
    if (gig.status !== "open") {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "This gig has already been assigned",
      });
    }

    // ATOMIC OPERATIONS START
    // 1. Update gig status to 'assigned'
    await Gig.findByIdAndUpdate(gig._id, { status: "assigned" }, { session });

    // 2. Update hired bid status to 'hired'
    await Bid.findByIdAndUpdate(bid._id, { status: "hired" }, { session });

    // 3. Update all other bids for this gig to 'rejected'
    await Bid.updateMany(
      {
        gigId: gig._id,
        _id: { $ne: bid._id },
        status: "pending",
      },
      { status: "rejected" },
      { session }
    );

    // Commit transaction
    await session.commitTransaction();

    // Get updated bid with populated data
    const updatedBid = await Bid.findById(bid._id)
      .populate("freelancerId", "name email")
      .populate("gigId", "title description budget");

    // BONUS 2: Real-time notification via Socket.io
    const io = req.app.get("io");
    io.to(bid.freelancerId._id.toString()).emit("hired", {
      message: `You have been hired for "${gig.title}"!`,
      gigTitle: gig.title,
      gigId: gig._id,
      bidId: bid._id,
    });

    res.json({
      success: true,
      message: "Freelancer hired successfully",
      bid: updatedBid,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
});

module.exports = router;
