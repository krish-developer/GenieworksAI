import { Document, Model, Schema, model, modelNames, models } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name: string;
  limit: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  clerkId: { type: String },
  email: { type: String },
  name: { type: String },
  limit: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const User: Model<IUser> = models?.User || model("User", userSchema);

export default User;
