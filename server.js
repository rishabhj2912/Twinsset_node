const express = require('express');
const connectDB = require('./config/db');
const {check, validationResult } = require("express-validator/check");

const app = express();

//connect to the mongoDB database
connectDB();

//middleware
app.use(express.json({ extended: false}));

app.get('/', (req, res) => res.send('API Running'));

//Routes
app.use("/register",require("./routes/api/users"));
app.use("/login",require("./routes/api/auth"));
app.use("/template",require("./routes/api/template"));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server started on port "+PORT ));