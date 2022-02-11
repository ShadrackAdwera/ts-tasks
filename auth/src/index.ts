import mongoose from 'mongoose';

import { app } from './app';

if(!process.env.JWT_KEY) {
    throw new Error('JWT is not defined!');
}

if(!process.env.MONGO_URI) {
    throw new Error('MONGO URI is not defined!');
}

const start = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        app.listen(5000);
        console.log('Connected to Auth Service, listening on PORT: 5000');
    } catch (error) {
        console.log(error);
    }
}

start();