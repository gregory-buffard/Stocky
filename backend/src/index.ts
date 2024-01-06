import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

const URI = process.env.MONGODB_URI || '';
mongoose.connect(URI);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
