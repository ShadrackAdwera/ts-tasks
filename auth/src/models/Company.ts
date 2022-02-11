import mongoose, { Schema, Model, Document } from 'mongoose';

interface CompanyDoc extends Document {
    name: string;
    version: number;
}

interface CompanyModel extends Model<CompanyDoc> {
    name: string;
}

const companySchema = new Schema({
    name: { type: String, required: true }
}, { timestamps: true, toJSON: { getters: true } });

const Company = mongoose.model<CompanyDoc, CompanyModel>('company', companySchema);

export { Company };