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
        customScrollbars: {
          type: Boolean,
          default: true,
          required: false,
        },
        animations: {
          type: Boolean,
          default: true,
          required: false,
        },
        direction: {
          type: String,
          default: "ltr",
          required: false,
        },
        layout: {
          style: {
            type: String,
            default: "layout1",
            required: false,
          },
          config: {
            scroll: {
              type: String,
              default: "content",
              required: false,
            },
            navbar: {
              display: {
                type: Boolean,
                default: true,
                required: false,
              },
              folded: {
                type: Boolean,
                default: true,
                required: false,
              },
              position: {
                type: String,
                default: "left",
                required: false,
              },
            },
            toolbar: {
              display: {
                type: Boolean,
                default: true,
                required: false,
              },
              style: {
                type: String,
                default: "fixed",
                required: false,
              },
              position: {
                type: String,
                default: "below",
                required: false,
              },
            },
            footer: {
              display: {
                type: Boolean,
                default: true,
                required: false,
              },
              style: {
                type: String,
                default: "fixed",
                required: false,
              },
              position: {
                type: String,
                default: "below",
                required: false,
              },
            },
            mode: {
              type: String,
              default: "fullwidth",
              required: false,
            },
          },
        },
        theme: {
          main: {
            type: String,
            default: "defaultDark",
            required: false,
          },
          navbar: {
            type: String,
            default: "defaultDark",
            required: false,
          },
          toolbar: {
            type: String,
            default: "defaultDark",
            required: false,
          },
          footer: {
            type: String,
            default: "defaultDark",
            required: false,
          },
        },
      },
      shortcuts: {
        type: Array,
        required: false,
      }
    },
  },
  {
    timestamps: true,
  }
);

mongoose.set("useCreateIndex", true);
UserSchema.plugin(uniqueValidator);

export default mongoose.model("User", UserSchema);
