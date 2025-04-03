const express=require('express');
const router=express.Router();
const getAllQuestions=require('../../controllers/adminController');
router.use('/', getAllQuestions);

module.exports=router;