import { Listener, TaskCreated, Subjects } from '@adwesh/v2-common';
import { Message } from 'node-nats-streaming';
import { Task } from '../../models/Models';

export class TaskCreatedListener extends Listener<TaskCreated> {
    subject: Subjects.TaskCreated = Subjects.TaskCreated;
    queueGroupName: string = 'cronjobs-service';
    async onMessage(data: { id: string; title: string; description: string; category: string; image: string; createdBy: string; assignedTo: string | undefined; status: string; version: number; }, msg: Message): Promise<void> {
        const { id, category, status, version } = data;

        try {
            const newTask = new Task({
                taskId: id, category, status, assignedTo: undefined, version});
                await newTask.save();
                msg.ack();
        } catch (error) {
            throw new Error(<string>error);
        }

    }
    
}