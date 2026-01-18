import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: Number, default: 0}, // 0: regular user, 1: admin
    department: {
        type: String,
        enum: [
            "SALES department",
            "MARKETING department",
            "WAREHOUSE department",
            "PURCHASING department",
            "LOGISTICS department",
            "FINANCE department",
            "ADMIN department"
        ],
        required: true
    },
    isActive: {type: Boolean, default: true},
    image: {type: String, default: ''}
}, {timestamps: true})

const User = mongoose.model('User', userSchema)

export default User;