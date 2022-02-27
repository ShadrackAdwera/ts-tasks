import mongoose, { Schema, Model, Document } from 'mongoose';

interface CompanyDoc extends Document {
    name: string;
    createdBy: string;
    version: number;
}

interface CompanyModel extends Model<CompanyDoc> {
    name: string;
    createdBy: string;
}

const companySchema = new Schema({
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId }
}, { timestamps: true, toJSON: { getters: true } });

const Company = mongoose.model<CompanyDoc, CompanyModel>('company', companySchema);

export { Company };