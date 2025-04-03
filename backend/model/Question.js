const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    prompt: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        validate: {
            validator: arr => arr.length === 4, 
            message: 'Exactly 4 options are required'
        },
        required: true
    },
    correct: {
        type: Number,
        required: true,
        validate: {
            validator: num => num >= 0 && num <= 3, 
            message: 'Correct answer must be an index between 0 and 3'
        }
    }
});

module.exports = mongoose.model('Question', questionSchema);
