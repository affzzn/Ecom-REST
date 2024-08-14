import express from 'express';
import connectDB from './database/db';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';



import authRouter from './routes/auth';
import userRouter from './routes/user';
import verifyJWT from './middlewares/verifyJWT.middleware';

const app = express();
const port = 8000 || process.env.PORT;


app.use(express.json());
app.use(cookieParser());




app.use('/api/auth', authRouter);
app.use('/api/user', verifyJWT , userRouter);



app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});





