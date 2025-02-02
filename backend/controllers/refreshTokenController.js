const jwt=require('jsonwebtoken');
const User=require('../model/User');

const refreshTokenController= async(req, res, next)=>{
    // const cookies=req.cookies;
    // if(!cookies?.refreshToken){//optional chaining
    //     return res.status(401).send("No refresh token cookie found");//unauthorized status code, meaning that the user is not authenticated
    // }
    // const refreshToken=cookies.refreshToken;
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).send("No refresh token found in the request body"); // Unauthorized
    }

    const user = await User.findOne({ refreshToken: refreshToken }).exec(); // Check if the user exists
    if (!user) {
        return res.status(403).json({ 'message': 'User not found' }); // Forbidden
    }
    jwt.verify(refreshToken, 
        process.env.REFRESH_TOKEN_SECRET,
        (err, decodedToken)=>{
            if(err || user.username!==decodedToken.username){
                return res.status(403).json({ 'message' : 'Invalid token. Login again or stop trying to hack into the system' });//forbidden status code, meaning that the token has been tampered with or has expired
            }
                const accessToken=jwt.sign({
                    username: user.username
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );
            res.json({ accessToken });
        }
    )
}

module.exports=refreshTokenController;
