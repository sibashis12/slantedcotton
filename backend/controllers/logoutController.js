const User=require('../model/User');

const logoutController = async(req, res)=>{
    //make sure to delete the refresh token and the access token from the memory on frontend
    try{
        const { refreshToken } = req.body;  // Now, we expect the refreshToken to be sent in the request body.

        if (!refreshToken) {
            return res.sendStatus(204);  // No content (no refresh token provided)
        }

        // const cookies=req.cookies;
        // if(!cookies?.refreshToken){//optional chaining
        //     return res.sendStatus(204);
        // }
        // const refreshToken=cookies.refreshToken;
        const user=await User.findOne({refreshToken: refreshToken}).exec();//check if the user exists
        // if(!user){//if no user found we clear the cookie
        //     res.clearCookie('refreshToken', { httpOnly: true, domain: 'localhost', 
        //         path: '/' });//set sameSite:'None' secure: true in production
        //     return res.sendStatus(204);
        // }
        if (!user) {
            // If no user found with the provided refresh token, just send a 204
            return res.sendStatus(204);
        }
        user.refreshToken="";//erase the refresh token
        await user.save();
        // res.clearCookie('refreshToken', { httpOnly: true, domain: 'localhost', 
        //     path: '/' }); //set sameSite:'None' secure: true in production
        return res.sendStatus(204);
    }
    catch(err){
        res.status(500).send(err.message);
    }
}

module.exports=logoutController;