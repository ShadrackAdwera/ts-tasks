import mongoose from 'mongoose';
import { natsWraper } from '@adwesh/common';
import { UserCreatedListener } from './events/listeners/user-created-event';
import { TaskCreatedListener } from './events/listeners/task-created-event';
import { handleCronJobs } from './cron';
import { CategoryCreatedListener } from './events/listeners/category-created-event';

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

        await natsWraper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URI!);
        natsWraper.client.on('close', () => {
            console.log('NATS shutting down . . .');
            process.exit();
        });

        new UserCreatedListener(natsWraper.client).listen();
        new TaskCreatedListener(natsWraper.client).listen();
        new CategoryCreatedListener(natsWraper.client).listen();

        process.on('SIGINT', () => natsWraper.client.close());
        process.on('SIGTERM', () => natsWraper.client.close());

        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to Cron Service');
    } catch (error) {
        console.log(error);
    }
}

start();
handleCronJobs();