const express=require('express');
const router=express.Router();
const { adminLoginController }=require('../controllers/adminLoginController')

router.use('/', adminLoginController);

module.exports=router;
