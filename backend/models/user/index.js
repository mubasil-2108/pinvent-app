const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid emaial",
        ],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minLength: [6, 'Password should be at least 6 characters long'],
    },
    photo: {
        type: String,
        required: [true, 'Photo is required'],
        default: 'https://i.ibb.co/4pDNDk1/avatar.png'
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        default: '+234'
    },
    bio: {
        type: String,
        required: [true, 'Bio is required'],
        maxLength: [250, 'Bio should be at most 250 characters long'],
        trim: true,
        default: 'bio'
    },
},
    {
        timestamps: true
    }

)

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
       return next();
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next(); 
} )

const USER = mongoose.model('user', userSchema);
module.exports = USER