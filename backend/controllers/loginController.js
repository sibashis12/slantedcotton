const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginController = async (req, res) => {
    // console.log(req.body);
    const { username, pwd } = req.body;

    if (!username || !pwd) {
        return res.status(400).json({ 'message': "Username and password are required." });
    }

    const user = await User.findOne({ username: username }).exec();

    if (!user) {
        return res.status(401).json({ 'message': 'User not found' }); // Unauthorized
    }

    const match = await bcrypt.compare(pwd, user.password);
    if (!match) {
        return res.status(401).json({ 'message': 'Invalid password' }); // Unauthorized
    }

    try {
        const accessToken = jwt.sign({
            username: user.username,
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign({
            username: user.username,
        },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        /*
        if (user.refreshToken) {
            res.clearCookie('refreshToken', {
                httpOnly: true, domain: 'localhost',
                path: '/' // set sameSite:'None' secure: true in production
            });
        }
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, maxAge: 24 * 60 * 60 * 1000, domain: 'localhost',
            path: '/' // set sameSite:'None' secure: true in production
        });
        */

        res.status(200).json({
            accessToken: accessToken,
            username: user.username,
            refreshToken: refreshToken // Send refresh token as part of the response body
        });

        // Store refreshToken in the user object (if needed for future use)
        user.refreshToken = refreshToken;
        await user.save();
    } catch (err) {
        return res.status(500).json({ 'message': err.message });
    }
};

module.exports = { loginController };
