import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import billRouter from './routes/bills-route';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth-route';
import cron from 'node-cron';
import processDailyBillsAndReminders from './jobs/billProcessor';
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;


connectDB();

cron.schedule('0 0 * * *', async () => {
  // This cron job runs everyday at midnight
  await processDailyBillsAndReminders();
  
});


app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/bills', billRouter);

app.listen(port, () => {
  console.log(`Server is Fire at https://localhost:${port}`);
});