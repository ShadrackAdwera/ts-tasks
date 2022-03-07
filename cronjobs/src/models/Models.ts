import { Schema, Document, Model, model } from 'mongoose';

enum taskStatus { pending='Pending', complete='Complete', cancelled='Cancelled' };

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

const taskSchema = new Schema({
    taskId: { type: Schema.Types.ObjectId, required: true },
    category: { type: Schema.Types.ObjectId, required: true, ref: 'category' },
    status: { type: String, required: true, enum: Object.values(taskStatus), default: taskStatus.pending },
    assignedTo: { type: Schema.Types.ObjectId, required: true }
}, { timestamps: true, toJSON: { getters: true } });


