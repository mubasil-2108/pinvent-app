require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const errorHandler = require('./middleware/error');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(errorHandler);


mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log('connected to database');
    })
    .catch((err) => {
        console.log(err);
    })

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

app.use(cors());

app.get("/",(req,res)=>{
    res.send("Backend is running")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})