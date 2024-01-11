import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface INotification {
    message: string;
    date: Date;
}

export interface IUser extends Document {
    email: string;
    password: string;
    stocks: Array<{
        symbol: string;
    }>;
    notifications: INotification[];
    comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    stocks: [{
        symbol: {type: String, required: true},
    }],
    notifications: [{
        message: {type: String, required: true},
        date: {type: Date, default: Date.now}
    }]
})

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema, 'users');