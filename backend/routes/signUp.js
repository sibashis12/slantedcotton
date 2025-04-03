const express=require('express');
const router=express.Router();
const signUpController=require('../controllers/signUpController')

router.use('/', signUpController);

module.exports=router;
