import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    githubId:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    username:{
        type:String,
        required:true,
        trim: true,
    },
    email:{
        type:String,
        required: true,
        trim:true,
    },
    avatarUrl:{
        type:String,
    },
    accessToken:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['user', 'admin']
    },
},{timestamps:true});

const User = new mongoose.model("User", userSchema)

export default User;