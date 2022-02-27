import mongoose, { Schema, Model, Document } from 'mongoose';

interface SectionDoc extends Document {
    name: string;
    createdBy: string;
    version: number;
}

interface SectionModel extends Model<SectionDoc> {
    name: string;
    createdBy: string;
}

const sectionSchema = new Schema({
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId }
}, { timestamps: true, toJSON: { getters: true } });

const Section = mongoose.model<SectionDoc, SectionModel>('section', sectionSchema);

export { Section };