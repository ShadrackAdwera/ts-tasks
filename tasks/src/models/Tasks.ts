import { Schema, Document, Model, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TasksDoc extends Document {
    title: string;
    description: string;
    category: string;
    priority: string;
    image: string;
    createdBy: string;
    assignedTo?: string;
    version: number;
}

interface TaskModel extends Model<TasksDoc> {
    title: string;
    description: string;
    category: string;
    priority: string;
    image: string;
    createdBy: string;
    assignedTo?: string;
}

const tasksModel = new Schema({
    title: { type: String, required: true },
    description : { type: String, required: true },
    category: { type: Schema.Types.ObjectId, required: true },
    image: { type: String },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    assignedTo: { type: Schema.Types.ObjectId }
}, { timestamps: true, toJSON: { getters: true } });

tasksModel.set('versionKey','version');
tasksModel.plugin(updateIfCurrentPlugin);

const Task = model<TasksDoc, TaskModel>('task', tasksModel);

export { Task };