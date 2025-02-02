const express=require('express');
const router=express.Router();
const getAllUsers=require('../../controllers/userController');
router.use('/', getAllUsers);

module.exports=router;