import bcrypt from "bcrypt";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  userName: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// password hash middleware
UserSchema.pre<IUser>("save", async function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// validating user's password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;