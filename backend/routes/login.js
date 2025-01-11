const express=require('express');
const router=express.Router();
const { loginController }=require('../controllers/loginController')

router.use('/', loginController);

module.exports=router;
