const express=require('express');
const router=express.Router();
const logoutController=require('../controllers/logoutController');

router.use('/', logoutController);

module.exports=router;