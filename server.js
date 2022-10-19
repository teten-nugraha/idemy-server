import express from "express";
import cors from "cors";
import fs from "fs";
import mongoose from "mongoose";

const morgan = require('morgan');
require('dotenv').config();

// create express app
const app = express();

// db
mongoose
    .connect(process.env.DATABASE)
    .then(() => console.log("**DB CONNECTED**"))
    .catch((err) => console.log("DB CONNECTION ERR => ", err));

//apply middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// route
app.get('/', (req, res) => {
    res.send("You hit / endpoint");
});
fs.readdirSync("./routes").map((r) =>
    app.use('/api', require(`./routes/${r}`))
);

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`))
