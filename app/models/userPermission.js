const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const UserPermissionSchema = new mongoose.Schema(
    {
        permissionId: {
            type: String,
            required: true
        },
        addedAdminId: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

UserPermissionSchema.plugin(mongoosePaginate)
module.exports = UserPermissionSchema