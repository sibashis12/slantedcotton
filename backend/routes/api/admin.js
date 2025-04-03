const express = require('express');
const router = express.Router();
const Question = require('../../model/Question'); // Import question model

// GET: Fetch all questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Add a new question
router.post('/questions', async (req, res) => {
    const { prompt, options, correct } = req.body;

    if (!prompt || !Array.isArray(options) || options.length !== 4 || correct < 0 || correct > 3) {
        return res.status(400).json({ message: "Invalid question data" });
    }
    
    try {
        const newQuestion = new Question({ prompt, options, correct });
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT: Update a question
router.put('/questions/:id', async (req, res) => {
    try {
        const { prompt, options, correct } = req.body;

        if (!prompt?.trim() || !Array.isArray(options) || options.length !== 4 || correct < 0 || correct > 3) {
            return res.status(400).json({ message: "Invalid question update data" });
        }

        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            { prompt, options, correct },
            { new: true, runValidators: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json(updatedQuestion);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE: Remove a question
router.delete('/questions/:id', async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }
        res.json({ message: "Question deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
