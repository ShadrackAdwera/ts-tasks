import { Publisher, Subjects, UserCreatedEvent } from '@adwesh/v2-common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
    subject: Subjects.UserCreated = Subjects.UserCreated;
}