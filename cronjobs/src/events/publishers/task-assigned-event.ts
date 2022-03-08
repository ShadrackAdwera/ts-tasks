import { Publisher, TaskUpdated, Subjects } from '@adwesh/v2-common';

export class TaskUpdatedPublisher extends Publisher<TaskUpdated> {
    subject: Subjects.TaskUpdated = Subjects.TaskUpdated;
}