const express=require('express');
const router=express.Router();
const refreshTokenController=require('../controllers/refreshTokenController');

router.get('/', refreshTokenController);//only get requests should be made at this route to get new access tokens

module.exports=router;