import { Schema, Document, Model, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface SectionDoc extends Document {
    name: string;
    createdBy: string;
    sectionId: string;
    version: number;
}

interface SectionModel extends Model<SectionDoc> {
    name: string;
    sectionId: string;
    createdBy: string;
}

const sectionSchema = new Schema({
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    sectionId: { type: String }
}, { timestamps: true, toJSON: { getters: true } });

sectionSchema.set('versionKey','version');
sectionSchema.plugin(updateIfCurrentPlugin);

const Section = model<SectionDoc, SectionModel>('section', sectionSchema);

export { Section };