import mongoose from 'mongoose';

import { app } from './app';
import { natsWraper } from '@adwesh/common';
import { SectionCreatedListener } from './events/section-created-listener';

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

        process.on('SIGINT', () => natsWraper.client.close());
        process.on('SIGTERM', () => natsWraper.client.close());

        new SectionCreatedListener(natsWraper.client).listen();

        await mongoose.connect(process.env.MONGO_URI!);
        app.listen(5002);
        console.log('Connected to Sections Service, listening on PORT: 5002');
    } catch (error) {
        console.log(error);
    }
}

start();