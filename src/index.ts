import express from 'express';
import { connectDB } from './database/db';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 8000 || process.env.PORT;



app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});