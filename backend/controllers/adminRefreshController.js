const jwt=require('jsonwebtoken');
const Admin=require('../model/Admin');

const adminRefreshController= async(req, res, next)=>{
    // const cookies=req.cookies;
    // if(!cookies?.refreshToken){//optional chaining
    //     return res.status(401).send("No refresh token cookie found");//unauthorized status code, meaning that the admin is not authenticated
    // }
    // const refreshToken=cookies.refreshToken;
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).send("No refresh token found in the request body"); // Unauthorized
    }

    const admin = await Admin.findOne({ refreshToken: refreshToken }).exec(); // Check if the admin exists
    if (!admin) {
        return res.status(403).json({ 'message': 'Admin not found' }); // Forbidden
    }
    jwt.verify(refreshToken, 
        process.env.REFRESH_TOKEN_SECRET,
        (err, decodedToken)=>{
            if(err || admin.username!==decodedToken.username){
                return res.status(403).json({ 'message' : 'Invalid token. Login again or stop trying to hack into the system' });//forbidden status code, meaning that the token has been tampered with or has expired
            }
                const accessToken=jwt.sign({
                    username: admin.username
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );
            res.json({ accessToken });
        }
    )
}

module.exports=adminRefreshController;
