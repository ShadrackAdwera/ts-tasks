import { Publisher, Subjects, TaskCreated } from '@adwesh/v2-common';

class TaskCreatedPublisher extends Publisher<TaskCreated> {
    subject: Subjects.TaskCreated = Subjects.TaskCreated;
}