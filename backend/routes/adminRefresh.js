const express=require('express');
const router=express.Router();
const adminRefreshController=require('../controllers/adminRefreshController');

router.get('/', adminRefreshController);//only get requests should be made at this route to get new access tokens

module.exports=router;