const User=require('../model/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const loginController= async(req, res)=>{
    const { username, pwd }=req.body;
    if(!username || !pwd){
        return res.status(400).json({ 'message' : "Username and password are required." });
    }
    const user = await User.findOne({username: username}).exec();
    if(!user){
        return res.sendStatus(401); //Unauthorized
    }
    const match=await bcrypt.compare(pwd, user.password);
    if(!match){
        return res.sendStatus(401); //Unauthorized
    }
    try{
        const roles=Object.values(user.roles);
        const accessToken=jwt.sign({
            username: user.username,
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        const refreshToken=jwt.sign({
            username: user.username,
        },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24*60*60*1000 });//use secure: true for https in production
        user.refreshToken=refreshToken;
        await user.save();
        res.json({ accessToken });//res.json immediately sends the response so keep it at the end
    }
    catch(err){
        return res.sendStatus(500);
    }
}

module.exports={ loginController };