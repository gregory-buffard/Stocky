import express from 'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import 'dotenv/config';
import User from "./models/User";
import jwt from 'jsonwebtoken';
import authenticate from "./middleware";
import cors from 'cors';
import stockRoutes from "./stockRoutes";
import "./stockPriceMonitor";
import {UserRequest} from "./types";

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use('/api/stocks', stockRoutes);

const URI = process.env.MONGODB_URI || '';
const JWT = process.env.JWT_SECRET || '';

mongoose.connect(URI);

app.post('/register', async (req, res) => {
    try {
        const {email, password} = req.body;

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'User already exists.'})
        }

        const user = new User({email, password});
        await user.save();

        const token = jwt.sign({id: user._id}, JWT, {expiresIn: '365d'});
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({message: 'Something went wrong.'})
    }
});

app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({message: "Invalid credentials."})
        }

        const token = jwt.sign({id: user._id}, JWT, {expiresIn: '365d'});
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({message: 'Something went wrong.'})
    }
})

app.get('/notifications', authenticate, async (req: UserRequest, res) => {
    if (!req.user) {
        return res.status(401).send({message: 'Unauthorized.'});
    }

    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send('User not found.');
        }

        res.json({notifications: user.notifications});
    } catch (error) {
        res.status(500).json({message: 'Something went wrong.'});
    }
});

app.delete('/notifications/:notificationId', authenticate, async (req: UserRequest, res) => {
    if (!req.user) {
        return res.status(401).send({message: 'Unauthorized.'});
    }

    try {
        const userId = req.user._id;
        const notificationId = req.params.notificationId;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {$pull: {notifications: {_id: notificationId}}},
            {new: true}
        );

        if (!updatedUser) {
            return res.status(400).send('User not found.');
        }

        res.json({message: 'Notification deleted.', user: updatedUser});
    } catch (error) {
        res.status(500).json({message: 'Something went wrong.'});
    }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
