import mongoose from 'mongoose';

import { app } from './app';


if(!process.env.JWT_KEY) {
    throw new Error('JWT is not defined!');
}

if(!process.env.MONGO_URI) {
    throw new Error('MONGO URI is not defined!');
}

const startUp = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        app.listen(5001);
        console.log('Connected to Categories DB listening on PORT: 5001');
    } catch (error) {
        console.log(error);
    }
}

startUp();