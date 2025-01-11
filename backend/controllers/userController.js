const User=require('../model/User');

const getAllUsers = async (req, res) => {
    const users=await User.find();
    if(!users){
        res.json({message:'No users found.'})
    }
    res.json(users);
}

module.exports = {
    getAllUsers
}