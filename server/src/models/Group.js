const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minLength: 4
    }
});

const Group = mongoose.model('user_group', groupSchema);

module.exports = Group;