import { Listener, Subjects, UserCreatedEvent } from '@adwesh/v2-common';
import { Message } from 'node-nats-streaming';
import { Agent } from '../../models/Models';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
    subject: Subjects.UserCreated = Subjects.UserCreated;
    queueGroupName: string = 'cronjobs-service';
    async onMessage(data: { id: string; email: string; category: string; }, msg: Message) {
       //find user in db, if not exists, create them
       let foundUser;
       try {
           foundUser = await Agent.findOne({ userId: data.id }).exec();
       } catch (error) {
           throw new Error(<string>error);
       }
       if(foundUser) {
           msg.ack();
       }
       try {
           const newAgent = new Agent({ userId: data.id, email: data.email, category: data.category});
           await newAgent.save();
           msg.ack();
       } catch (error) {
           throw new Error(error as string);
       }
    }
}