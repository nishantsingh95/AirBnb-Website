import User from "../model/user.model.js"

const isUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === 'admin') {
            return res.status(403).json({ message: "Admins cannot perform this action. This is for regular users only." });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "Authorization check failed" });
    }
}

export default isUser
