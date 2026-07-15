const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const playlistRouter = require('./routes/playlistRoute');
const limiter = require("./middlewares/rate-limit");

const app = express();

// Middlewares
app.use(cors());
app.use(limiter)
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({
        sucess: true,
        message: "API Is working Fine"
    })
})

app.use("/yt-playlist", playlistRouter)


app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`)
})