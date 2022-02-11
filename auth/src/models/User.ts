import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import mongoose, { Schema, Model, Document } from 'mongoose';

// handle this using the npm package
enum userRoles { Admin='Admin', Agent='Agent', User='User' }

interface UserDoc extends Document {
    username: string;
    email: string;
    password: string;
    company: string;
    roles: string[];
    version: number;
}

interface UserModel extends Model<UserDoc> {
    username: string;
    email: string;
    password: string;
    company: string;
    roles: string[];
}

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, required: true },
    roles: [ { type: String, enum: Object.keys(userRoles), default: userRoles.User } ]
});

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);


const User = mongoose.model<UserDoc, UserModel>('user', userSchema);

export {  User };