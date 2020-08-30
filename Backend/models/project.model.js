import mongoose, {Schema} from "mongoose";
import uniqueValidator from "mongoose-unique-validator"


const ProjectSchema = new Schema(
    {
        projectName: {
            type: String,
            required: true,
            minlength: 2,
            trim: true
        },
        description: {
            type: Text,
            required: true,
            minlength: 30,
        },
        ownerId: {
            type: String,
            required: true,
        },
        userIds: [{
            type: String,
            required: true,
            trim: true
        }],
        milestones: [{
            title: {
                type: String,
                required: false
            },
            done: {
                type: Boolean,
                default: false,
                required: false
            },
        }],
        kanban: [{
            type: String,
            required: false
        }]

    },
    {
        timestamps: true
    }
);

mongoose.set("useCreateIndex", true);
ProjectSchema.plugin(uniqueValidator);

export default mongoose.model("Project", ProjectSchema);