import mongoose from 'mongoose';
import { natsWraper } from '@adwesh/common';
import { UserCreatedListener } from './events/listeners/user-created-event';

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
        await new UserCreatedListener(natsWraper.client).listen();
        console.log('Connected to Cron Service');
    } catch (error) {
        console.log(error);
    }
}

start();