const jwt=require('jsonwebtoken');
const User=require('../model/User');

const verifyJWT = async(req, res, next) => {
    const cookie=req.cookies;//checking if the user has the refresh token.
    if(!cookie?.jwt){
        return res.sendStatus(401);
    }
    const refreshToken=cookie.jwt;
    const user=await User.findOne({refreshToken: refreshToken}).exec();//check which user has this refresh token
    const authHeader=req.headers['authorization'];
    if(!authHeader?.startsWith('Bearer')){//checking if correct token header
        return res.sendStatus(401);
    }
    if(!user){
        res.clearCookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None'});
        return res.sendStatus(403);
    }
    const authToken=authHeader.split(' ')[1];//if the req has Bearer auth, it has info in form Bearer <token>
    jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken)=>{
        if(err || user.username!==decodedToken.username){
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None'});
            return res.sendStatus(403);//forbidden status code, denoting that it has been tampered with
        }
        req.user=decodedToken.username;
        next();
    })
}

module.exports=verifyJWT;