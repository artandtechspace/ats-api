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
        ipaddress:{
            type: String,
            validate: {
                validator: validator.isIP,
                message: 'IPADDRESS_IS_NOT_VALID'
            },
            required:true,
            unique:true
        },
        description: {
            type: String,
            required: true
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
)
PermissionSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Permission', PermissionSchema)
