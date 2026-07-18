const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const compression = require('compression')
const swaggerUi = require("swagger-ui-express");


const swaggerSpec = require("./utils/swagger");
const limiter = require("./middlewares/rate-limit");
const playlistRouter = require('./routes/playlistRoute');
const tiktokDownloaderRouter = require("./routes/tiktokDownRoute")
const instaDownloadRouter = require("./routes/instagramDownRoute")

const app = express();


// Middlewares
app.use(cors());
app.use(limiter)
app.use(compression())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
const PORT = process.env.PORT || 3000;

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health Check
 *     description: Checks whether the API server is running.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is running successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API Is working Fine
 */
app.get("/", (req, res) => {
    res.json({
        sucess: true,
        message: "API Is working Fine"
    })
})


app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "YouTube Playlist Downloader API",
    customCss: `
      .topbar{
        display:none;
      }

      .swagger-ui .information-container{
        padding-top:20px;
      }

      .swagger-ui .scheme-container{
        border-radius:12px;
      }

      .swagger-ui .opblock{
        border-radius:12px;
      }

      .swagger-ui .btn{
        border-radius:8px;
      }
    `,
}))

app.use("/yt-playlist", playlistRouter)
app.use("/tiktok",tiktokDownloaderRouter)
app.use("/insta",instaDownloadRouter)

app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`)
})