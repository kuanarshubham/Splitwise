import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
        index: true
    },

    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true
    },

    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    lend: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Money"
    }],

    collect: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Money"
    }],

    password: {
        type: String,
        required: true
    },

    refreshToken: {
        type: String,
    }


}, { timestamps: true });


userSchema.pre("save", async function(next){
    if (!(this.isModified("password"))) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}


export default User = mongoose.model("User", userSchema);