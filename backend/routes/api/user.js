const express=require('express');
const router=express.Router();
const getDetails=require('../../controllers/userController');
router.use('/', getDetails);

module.exports=router;