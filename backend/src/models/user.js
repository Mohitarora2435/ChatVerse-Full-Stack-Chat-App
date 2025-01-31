import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String, 
        required: true,
        unique: true 
    },
    name: {
        type: String,
        required: true, 
    },
    password: {
        type: String,
        required: true 
    },
    pfp: {
        type: String,
        default: "",
    },
},
{ timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;