const Question=require('../model/Question');

const getAllQuestions = async (req, res) => {
    const questions=await Question.find();
    if(!questions){
        res.status(200).json({message:'No questions found.'})
    }
    res.status(200).json({questions:questions});
}

module.exports = getAllQuestions