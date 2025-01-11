const jwt=require('jsonwebtoken');
const User=require('../model/User');

const refreshTokenController= async(req, res, next)=>{
    const cookies=req.cookies;
    if(!cookies?.jwt){//optional chaining
        return res.status(401).send("Send proper cookie");//unauthorized status code, meaning that the user is not authenticated
    }
    const refreshToken=cookies.jwt;
    const user=await User.findOne({refreshToken: refreshToken}).exec();//check if the user exists
    if(!user){
        return res.sendStatus(403);//forbidden status code, meaning that the user is trying to hack into system
    }
    jwt.verify(refreshToken, 
        process.env.REFRESH_TOKEN_SECRET,
        (err, decodedToken)=>{
            if(err || user.username!==decodedToken.username){
                return res.sendStatus(403);//forbidden status code, meaning that the token has been tampered with or has expired
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