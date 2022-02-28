import mongoose from 'mongoose';

import { app } from './app';

if(!process.env.JWT_KEY) {
    throw new Error('JWT is not defined!');
}

if(!process.env.MONGO_URI) {
    throw new Error('MONGO URI is not defined!');
}

if(!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
}

if(!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
}

if(!process.env.NATS_URI) {
    throw new Error('NATS_URI must be defined');
}

const start = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        app.listen(5003);
        console.log('Connected to Tasks Service, listening on PORT: 5003');
    } catch (error) {
        console.log(error);
    }
}

start();