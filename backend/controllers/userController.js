const User=require('../model/User');

const getAllUsers = async (req, res) => {
    const users=await User.find();
    if(!users){
        res.status(200).json({message:'No users found.'})
    }
    res.status(200).json({users:users});
}

module.exports = getAllUsers