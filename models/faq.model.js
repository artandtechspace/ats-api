import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const FaqSchema = new Schema(
    {
        question: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
    }
);

mongoose.set("useCreateIndex", true);
FaqSchema.plugin(uniqueValidator);

export default mongoose.model("FAQ", FaqSchema);
