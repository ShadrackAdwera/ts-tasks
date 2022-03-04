import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import mongoose, { Schema, Model, Document } from 'mongoose';

// handle this using the npm package
export enum userRoles { Admin='Admin', Agent='Agent', User='User' }

interface UserDoc extends Document {
    username: string;
    email: string;
    password: string;
    section: string;
    category: string;
    resetToken?: string,
    tokenExpirationDate?: Date,
    roles: string[];
    version: number;
}

interface UserModel extends Model<UserDoc> {
    username: string;
    email: string;
    password: string;
    section: string;
    category: string;
    resetToken?: string;
    tokenExpirationDate?: Date;
    roles: string[];
}

interface SectionDoc extends Document {
    name: string;
    createdBy: string;
    version: number;
}

interface SectionModel extends Model<SectionDoc> {
    name: string;
    createdBy: string;
}

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, min: 6 },
    section: { type: Schema.Types.ObjectId, required: true, ref: 'section' },
    category: { type: Schema.Types.ObjectId },
    resetToken: { type: String },
    tokenExpirationDate: { type: Date },
    roles: [ { type: String, enum: Object.keys(userRoles), default: userRoles.User } ]
}, { timestamps: true, toJSON: { getters: true } } );

const sectionSchema = new Schema({
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId }
}, { timestamps: true, toJSON: { getters: true } });

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);
sectionSchema.set('versionKey', 'version');
sectionSchema.plugin(updateIfCurrentPlugin);

const Section = mongoose.model<SectionDoc, SectionModel>('section', sectionSchema);
const User = mongoose.model<UserDoc, UserModel>('user', userSchema);

export { Section };
export {  User };