import mongoose, {Schema} from "mongoose";
import uniqueValidator from "mongoose-unique-validator"


const UserSchema = new Schema(
    {
        firstname: {
            type: String,
            required: true,
            minlength: 2,
            trim: true
        },
        lastname: {
            type: String,
            required: true,
            minlength: 2,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        webTokens: [{
            accessToken: {
                type: String,
                required: false
            },
            refreshToken: {
                type: String,
                required: false
            },
        }],
        restoreToken: {
            token: {
                type: String,
                required: false
            },
            used: {
                type: Boolean,
                default: false,
                required: false
            },
        },
    },
    {
        timestamps: true
    }
);

mongoose.set("useCreateIndex", true);
UserSchema.plugin(uniqueValidator);

export default mongoose.model("User", UserSchema);