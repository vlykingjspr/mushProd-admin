
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3001; // or any port you prefer

// Parse incoming JSON requests
app.use(bodyParser.json());

// Load your machine learning model
const model = joblib.load('your_model.joblib');

// API endpoint for predictions
app.post('/predict', (req: { body: { inputData: any; }; }, res: { json: (arg0: { prediction: any; }) => void; }) => {
    const inputData = req.body.inputData;

    // Make predictions using your model
    const prediction = model.predict(inputData);

    res.json({ prediction });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
