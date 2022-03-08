import { Publisher, Subjects, CategoryCreatedEvent } from '@adwesh/v2-common';

export class CategoryCreatedPublisher extends Publisher<CategoryCreatedEvent> {
    subject: Subjects.CategoryCreated = Subjects.CategoryCreated;
}