import { Listener, TaskUpdated, Subjects } from '@adwesh/v2-common';
import { Message } from 'node-nats-streaming';
import { Task } from '../../models/Tasks';

export class TaskUpdatedListener extends Listener<TaskUpdated> {
    subject: Subjects.TaskUpdated = Subjects.TaskUpdated;
    queueGroupName: string = 'tasks-service';
    async onMessage(data: { taskId: string; category: string; status: string; assignedTo: string | undefined; version: number; }, msg: Message): Promise<void> {
        const { taskId, assignedTo } = data;
        let foundTask;
        try {
            foundTask = await Task.findById(taskId).exec();
        } catch (error) {
            throw new Error(<string>error);
        }

        if(!foundTask) {
            msg.ack();
            throw new Error('This task dont exist anymo');
        }
        foundTask.assignedTo = assignedTo;
        try {
            await foundTask.save();
            msg.ack();
        } catch (error) {
            throw new Error('An error occured');
        }

    }
    
}