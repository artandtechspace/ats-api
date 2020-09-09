import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      default: "admin",
      required: true,
    },
    webTokens: [
      {
        accessToken: {
          type: String,
          required: false,
        },
        refreshToken: {
          type: String,
          required: false,
        },
      },
    ],
    restoreToken: {
      token: {
        type: String,
        required: false,
      },
      used: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    data: {
      settings: {
        layout: {
          style: {
            type: String,
            default: "layout1",
            required: true,
          },
          config: {
            scroll: {
              type: String,
              default: "content",
              required: true,
            },
            navbar: {
              display: {
                type: Boolean,
                default: true,
                required: true,
              },
              folded: {
                type: Boolean,
                default: true,
                required: true,
              },
              position: {
                type: String,
                default: "left",
                required: true,
              },
            },
            toolbar: {
              display: {
                type: Boolean,
                default: true,
                required: true,
              },
              style: {
                type: String,
                default: "fixed",
                required: true,
              },
              position: {
                type: String,
                default: "below",
                required: true,
              },
            },
            footer: {
              display: {
                type: Boolean,
                default: true,
                required: true,
              },
              style: {
                type: String,
                default: "fixed",
                required: true,
              },
              position: {
                type: String,
                default: "below",
                required: true,
              },
            },
            mode: {
              type: String,
              default: "fullwidth",
              required: true,
            },
          },
        },
        customScrollbars: {
          type: Boolean,
          default: true,
          required: true,
        },
        theme: {
          main: {
            type: String,
            default: "defaultDark",
            required: true,
          },
          navbar: {
            type: String,
            default: "defaultDark",
            required: true,
          },
          toolbar: {
            type: String,
            default: "defaultDark",
            required: true,
          },
          footer: {
            type: String,
            default: "defaultDark",
            required: true,
          },
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

mongoose.set("useCreateIndex", true);
UserSchema.plugin(uniqueValidator);

export default mongoose.model("User", UserSchema);
