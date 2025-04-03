const express=require('express');
const router=express.Router();
const adminLogoutController=require('../controllers/adminLogoutController');

router.use('/', adminLogoutController);

module.exports=router;