const User=require('../model/User');

const getDetails = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user }).select('points matches');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ points: user.points, matches: user.matches });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = getDetails;