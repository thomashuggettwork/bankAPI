const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    let data = [];
    fs.createReadStream('questions.csv')  // replace with path to your CSV file
        .pipe(csv())
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', () => {
            // Grouping the data by question_id to combine all answers to each question
            let questions = {};
            for (let row of data) {
                if (!questions[row.question_id]) {
                    questions[row.question_id] = {
                        question_text: row.question_text,
                        answers: []
                    };
                }
                questions[row.question_id].answers.push(row.answer_text);
            }
            // Converting the questions object to an array of objects
            questions = Object.values(questions);
            res.json(questions);
        });
});

app.listen(port, () => {
    console.log(`running on port ${port}`);
});
