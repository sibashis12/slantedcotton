const express=require('express');
const router=express.Router();
const adminRefreshTokenController=require('../controllers/adminRefreshTokenController');

router.get('/', adminRefreshTokenController);//only get requests should be made at this route to get new access tokens

module.exports=router;