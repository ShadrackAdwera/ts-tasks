import { Schema, Document, Model, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

enum taskStatus { pending='Pending', complete='Complete', cancelled='Cancelled' };
enum priorities { high='high', medium='medium', low='low' }

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

interface AgentDoc extends Document {
    userId: string;
    email: string;
    category: string;
}

interface AgentModel extends Model<AgentDoc> {
    userId: string;
    email: string;
    category: string;
}

interface CategoryDoc extends Document {
    categoryId: string;
    title: string;
    priority: string;
}

interface CategoryModel extends Model<CategoryDoc> {
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

const agentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    email: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, required: true, ref: 'category' }
});

const categorySchema = new Schema({
    categoryId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    priority: { type: String, required: true, enum: Object.values(priorities) }
});

taskSchema.set('versionKey', 'version');
taskSchema.plugin(updateIfCurrentPlugin);

const Task = model<TaskDoc, TaskModel>('Task', taskSchema);
const Agent = model<AgentDoc, AgentModel>('Agent', agentSchema);
const Category = model<CategoryDoc, CategoryModel>('Category', categorySchema);

export { Task, Agent, Category };
