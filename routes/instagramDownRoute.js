
const express = require("express");

const { instagramGetUrl } = require('instagram-url-direct')

const router = express.Router();

router.post("/download-video", async (req, res) => {
    try {
        const { tiktokUrl } = req.body;
        // if (!tiktokUrl) {
        //     return res.json({
        //         success: false,
        //         message: "please provide Valid tiktok URL"
        //     })
        // }
        // if (TikTokUrlValidator(tiktokUrl)) {
        //  const result =   await v1.Downloader(tiktokUrl)
        const result = await instagramGetUrl(tiktokUrl)
        return res.json({
            success: true,
            message: "your result is ready",
            data: result
        })
        // }
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
})

module.exports = router;