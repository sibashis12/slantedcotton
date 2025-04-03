const Admin=require('../model/Admin');

const adminLogoutController = async(req, res)=>{
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
        const admin=await Admin.findOne({refreshToken: refreshToken}).exec();//check if the admin exists
        // if(!admin){//if no admin found we clear the cookie
        //     res.clearCookie('refreshToken', { httpOnly: true, domain: 'localhost', 
        //         path: '/' });//set sameSite:'None' secure: true in production
        //     return res.sendStatus(204);
        // }
        if (!admin) {
            // If no admin found with the provided refresh token, just send a 204
            return res.sendStatus(204);
        }
        admin.refreshToken="";//erase the refresh token
        await admin.save();
        // res.clearCookie('refreshToken', { httpOnly: true, domain: 'localhost', 
        //     path: '/' }); //set sameSite:'None' secure: true in production
        return res.sendStatus(204);
    }
    catch(err){
        res.status(500).send(err.message);
    }
}

module.exports=adminLogoutController;