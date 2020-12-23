import mongoose, {Schema} from "mongoose";
import uniqueValidator from "mongoose-unique-validator"


const KanBanSchema = new Schema(
    {
        kanbanName: {
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
        accessIds: [{
            userId: {
                type: String,
                required: true,
                trim: true
            },
            privileg: {
                type: Boolean,
                default: false,
                required: false
            },
        }],
        cards: [{
            title: {
                type: String,
                required: true
            },
            shape: [{

                title: String,
                required: true
            }],
            ownerId: {
                type: String,
                required: true,
            },
        }],

    },
    {
        timestamps: true
    }
);

mongoose.set("useCreateIndex", true);
UserSchema.plugin(uniqueValidator);

export default mongoose.model("Project", ProjectSchema);