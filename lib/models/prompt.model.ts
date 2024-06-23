import { Document, Model, Schema, model, models } from "mongoose";

export interface IPrompt extends Document {
  prompt: string;
  type: "Conversation" | "Image" | "Video" | "Music" | "Code";
  response: string;
  images: string[];
  media: string;
  userId: string;
  createdAt: Date;
}

const promptSchema = new Schema<IPrompt>({
  prompt: { type: String, required: true },
  type: {
    type: String,
    enum: ["Conversation", "Image", "Video", "Music", "Code"],
    required: true,
  },
  response: String,
  images: [String],
  media: String,
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Prompt: Model<IPrompt> = models?.Prompt || model("Prompt", promptSchema);

export default Prompt;
