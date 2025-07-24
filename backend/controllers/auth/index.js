const asyncHandler = require('express-async-handler');
const USER = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all required fields");
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error("Password should be at least 6 characters long");
    }

    const checkUser = await USER.findOne({ email });

    if (checkUser) {
        res.status(400);
        throw new Error("User already exists");
    }

    const createUser = await USER.create({
        name,
        email,
        password,
    })

    const token = generateToken(checkUser?._id);

    res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        sameSite: 'none',
        secure: true, // Set to true if using HTTPS
    })

    if (createUser) {
        const { _id, name, email, photo, phone, bio } = createUser;
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token,
        })
    } else {
        res.status(400);
        throw new Error("User registration failed");
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Please fill in all required fields");
    }

    const checkUser = await USER.findOne({ email });

    if (!checkUser) {
        res.status(400);
        throw new Error("User does not exist");
    }

    const isPasswordMatched = await bcrypt.compare(password, checkUser.password);

    const token = generateToken(checkUser?._id);

    res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        sameSite: 'none',
        secure: true, // Set to true if using HTTPS
    })

    if (checkUser && isPasswordMatched) {
        const { _id, name, email, photo, phone, bio } = checkUser;
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token
        })
    } else {
        res.status(400);
        throw new Error("Invalid email or password");
    }

})


module.exports = {
    registerUser,
    loginUser
}