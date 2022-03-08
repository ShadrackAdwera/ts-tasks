import { Listener, CategoryCreatedEvent, Subjects } from '@adwesh/v2-common';
import { Message } from 'node-nats-streaming';
import { Category } from '../../models/Models';

export class CategoryCreatedListener extends Listener<CategoryCreatedEvent> {
    subject: Subjects.CategoryCreated = Subjects.CategoryCreated;
    queueGroupName: string = 'cronjobs-service';
    async onMessage(data: { id: string; title: string; description: string; priority: string; version: number; }, msg: Message): Promise<void> {
        const { id, title, description, priority, version } = data;
        const newCategory = new Category({
            categoryId: id,
            title, priority
        });

        try {
            await newCategory.save();
        } catch (error) {
            throw new Error(<string>error);
        }
    }
    
}