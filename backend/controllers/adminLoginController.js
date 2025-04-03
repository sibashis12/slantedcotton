const Admin = require('../model/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLoginController = async (req, res) => {
    // console.log(req.body);
    const { username, pwd } = req.body;

    if (!username || !pwd) {
        return res.status(400).json({ 'message': "Username and password are required." });
    }

    const admin = await Admin.findOne({ username: username }).exec();

    if (!admin) {
        return res.status(401).json({ 'message': 'Admin not found' }); // Unauthorized
    }

    const match = await bcrypt.compare(pwd, admin.password);
    if (!match) {
        return res.status(401).json({ 'message': 'Invalid password' }); // Unauthorized
    }

    try {
        const accessToken = jwt.sign({
            username: admin.username,
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign({
            username: admin.username,
        },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        /*
        if (admin.refreshToken) {
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
            username: admin.username,
            refreshToken: refreshToken // Send refresh token as part of the response body
        });

        // Store refreshToken in the admin object (if needed for future use)
        admin.refreshToken = refreshToken;
        await admin.save();
    } catch (err) {
        return res.status(500).json({ 'message': err.message });
    }
};

module.exports = { adminLoginController };
