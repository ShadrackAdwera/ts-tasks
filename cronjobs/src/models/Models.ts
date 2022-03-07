import { Schema, Document, Model, model } from 'mongoose';

interface TaskDoc extends Document {
    taskId: string;
    category: string;
    status: string;
    assignedTo?: string;
    version: number;
}

interface TaskModel extends Model<TaskDoc> {
    taskId: string;
    category: string;
    status: string;
    assignedTo?: string;
}

interface UserDoc extends Document {
    userId: string;
    email: string;
    category: string;
}

interface UserModel extends Model<UserDoc> {
    userId: string;
    email: string;
    category: string;
}

interface CategoryDoc extends Document {
    categoryId: string;
    title: string;
    priority: string;
}