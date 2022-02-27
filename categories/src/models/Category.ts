import mongoose, { Schema , Model} from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

const priorities = {
    high: 'high',
    medium: 'medium',
    low: 'low'
}

interface CategoryDoc extends Document {
    title: string;
    description: string;
    priority: string;
    version: number;
}

interface CategoryModel extends Model<CategoryDoc> {
    title: string;
    description: string;
    priority: string;
}

const categorySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, required: true, enum: Object.keys(priorities) }
}, { timestamps: true, toJSON: { getters: true } });

categorySchema.set('versionKey', 'version');
categorySchema.plugin(updateIfCurrentPlugin);

const Category = mongoose.model<CategoryDoc, CategoryModel>('category', categorySchema);

export { Category };