import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

dotenv.config();
const app = express();
app.use(express.json());

// connect database
connectDB();

// routes
app.get('/', (_, res) => res.send('API running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
