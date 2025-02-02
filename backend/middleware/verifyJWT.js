const jwt = require('jsonwebtoken');
const User = require('../model/User');

const verifyJWT = async (req, res, next) => {
    /*
    const cookie = req.cookies; 
    if (!cookie?.refreshToken) { 
        return res.status(401).json({ 'message': 'No refresh token cookie found' });
    }
    const refreshToken = cookie.refreshToken;
    */

    // Now, checking for the refresh token in the request body
    // console.log(req.body);
    const { accessToken, refreshToken } = req.body;
    if(!refreshToken) {
        return res.status(401).json({ 'message': 'No refresh token in request body' });
    }
    if(!accessToken){
        return res.status(401).json({ 'message': 'No access token in request body' });
    } 

    const user = await User.findOne({ refreshToken: refreshToken }).exec(); // Check which user has this refresh token
    // const authHeader = req.headers['authorization'];

    // if (!authHeader?.startsWith('Bearer')) { // Check if the correct token header is provided
    //     return res.status(401).json({ 'message': 'Invalid auth header' });
    // }

    if (!user) {
        /*
        res.clearCookie('refreshToken', { httpOnly: true }); // Set sameSite: 'None' secure: true in production
        */
        return res.status(403).json({ 'message': 'User not found' });
    }

    // const authToken = authHeader.split(' ')[1]; // Extract token from Bearer <token>
    const authToken=req.body.accessToken;
    jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
        if (err || user.username !== decodedToken.username) {
            /*
            res.clearCookie('refreshToken', { httpOnly: true }); // Set sameSite: 'None' secure: true in production
            */
            return res.status(403).json({ 'refresh': 'Try refreshing with refresh token' }); // Forbidden status code, token has been tampered with
        }

        req.user = decodedToken.username;
        next();
    });
};

module.exports = verifyJWT;
