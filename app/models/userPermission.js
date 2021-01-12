const mongoose = require('mongoose')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')
const userPermRevoke = require('./userPermissionRevoke')

const UserPermissionSchema = new mongoose.Schema(
    {
        permissionId: {
            type: String,
            required: true
        },
        addedAdminId: {
            type: String,
            required: true
        },
        permRevoke: [userPermRevoke]
    },
    {
        versionKey: false,
        timestamps: true
    }
)

UserPermissionSchema.plugin(mongoosePaginate)
module.exports = UserPermissionSchema