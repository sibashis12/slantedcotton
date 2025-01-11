const bcrypt=require('bcrypt');
const User=require('../model/User');

const signUpController= async(req, res)=>{
    const { username, pwd, email }=req.body;
    if(!username || !pwd || !email){
        return res.status(400).json({ 'message' : "Username, email-id and password are required." });
    }
    const duplicate = await User.findOne({username: username, email: email}).exec();  
    if(duplicate){
        return res.status(409).json({ 'message' : 'User already exists.' }); //Conflict
    }
    try{
        const hashedPwd=await bcrypt.hash(pwd, 15);
        const result=await User.create({ username: username, password: hashedPwd, email: email });//automatically creates object id and version key
        res.status(201).json({ 'success': `New user ${username} created!` });
    }
    catch(err){
        res.status(500).send(err.message);
    }
}

module.exports={ signUpController };