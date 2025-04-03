const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true,
        default: 0
    },
    matches: {
        type: Number,
        required: true,
        default: 0
    },
    refreshToken: String
});

module.exports=mongoose.model('User', userSchema);