const User=require('../model/User');

const logoutController = async(req, res)=>{
    //make sure to delete the refresh token and the access token from the memory on frontend
    try{
        const cookies=req.cookies;
        if(!cookies?.jwt){//optional chaining
            return res.sendStatus(204);
        }
        const refreshToken=cookies.jwt;
        const user=await User.findOne({refreshToken: refreshToken}).exec();//check if the user exists
        if(!user){//if no user found we clear the cookie
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });//secure: true for https in production code
            return res.sendStatus(204);
        }
        user.refreshToken="";//erase the refresh token
        await user.save();
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' }); //secure: true for https in production code
        return res.sendStatus(204);
    }
    catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
}

module.exports=logoutController;