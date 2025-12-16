import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser } from "../controllers/user.controller.js"
import User from "../model/user.model.js"


let userRouter = express.Router()

userRouter.get("/currentuser",isAuth,getCurrentUser)

// Add to favorites
userRouter.post("/addfavorite/:listingId", isAuth, async (req, res) => {
    try {
        const { listingId } = req.params;
        const user = await User.findById(req.userId);

        if (!user.favorites.includes(listingId)) {
            user.favorites.push(listingId);
            await user.save();
        }

        res.status(200).json({ message: "Added to favorites", favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Remove from favorites
userRouter.post("/removefavorite/:listingId", isAuth, async (req, res) => {
    try {
        const { listingId } = req.params;
        const user = await User.findById(req.userId);

        user.favorites = user.favorites.filter(fav => fav.toString() !== listingId);
        await user.save();

        res.status(200).json({ message: "Removed from favorites", favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get user favorites
userRouter.get("/favorites", isAuth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("favorites");
        res.status(200).json({ favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default userRouter

