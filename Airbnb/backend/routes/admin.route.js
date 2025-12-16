import express from "express";
import isAuth from "../middleware/isAuth.js";
import User from "../model/user.model.js";
import Booking from "../model/booking.model.js";

const router = express.Router();

// Get all users (admin only)
router.get("/users", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const users = await User.find().select("-password").populate("listing booking");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all bookings (admin only)
router.get("/bookings", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const bookings = await Booking.find()
      .populate("host", "name email")
      .populate("guest", "name email")
      .populate("listing", "title city landMark rent");

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete user (admin only)
router.delete("/user/:id", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.userId) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
