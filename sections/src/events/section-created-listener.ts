import { SectionCreatedEvent, Subjects, Listener } from '@adwesh/v2-common';
import { Message } from 'node-nats-streaming';

import { Section } from '../models/Section';

const AUTH_QUEUE_GROUP = 'auth-service';

export class SectionCreatedListener extends Listener<SectionCreatedEvent> {
    subject: Subjects.SectionCreated = Subjects.SectionCreated;
    queueGroupName: string = AUTH_QUEUE_GROUP;
    async onMessage(data: { id: string; title: string; createdBy: string; }, msg: Message) {
        const { title, createdBy, id } = data;
        const newSection = new Section({ name: title, createdBy, sectionId: id });

        try {
            await newSection.save();
            msg.ack();
        } catch (error) {
            console.log(error);
            throw new Error('An error occured, try again');
        }
    }

}