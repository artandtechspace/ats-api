const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const PermissionSchema = new mongoose.Schema(
    {
        permission: {
            type: String,
            required: true,
            unique: true
        },
        type: {
            type: String,
            enum: ["machine", "door", "equipment"],
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)
PermissionSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Permission', PermissionSchema)
