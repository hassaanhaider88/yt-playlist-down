const express = require("express");
// const tiktokdl = require('@faouzkk/tiktok-dl');
const Tiktok = require("@tobyg74/tiktok-api-dl")
const fs = require("fs");
const path = require("path");

const router = express.Router();
const TikTokUrlValidator = require("../utils/TikTokUrlValidation");



router.post("/download-video", async (req, res) => {
    try {
        const { tiktokUrl } = req.body;
        if (!tiktokUrl) {
            return res.json({
                success: false,
                message: "please provide Valid tiktok URL"
            })
        }
        if (TikTokUrlValidator(tiktokUrl)) {
            const result = await Tiktok.Downloader(tiktokUrl, {
                version: "v1",
                showOriginalResponse: true
            })
            return res.json({
                success: true,
                message: "your result is ready",
                data: result?.resultNotParsed?.content?.video?.play_addr?.url_list
            })

        } else {
            return res.json({
                success: false,
                message: "please provide Valid tiktok URL"
            })
        }


    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
})


router.post("/download-images", async (req, res) => {
    try {
        const { tiktokUrl } = req.body;
        if (!tiktokUrl) {
            return res.json({
                success: false,
                message: "please provide Valid tiktok URL"
            })
        }
        if (TikTokUrlValidator(tiktokUrl)) {
            const result = await Tiktok.Downloader(tiktokUrl, {
                version: "v1",
                showOriginalResponse: true
            })
            const imagesArray = [
                ...new Set(
                    (result?.resultNotParsed?.content?.image_post_info?.images ?? [])
                        .map((img) =>
                            img.display_image?.url_list?.find((url) => url.includes("p16"))
                        )
                        .filter(Boolean)
                ),
            ];
            const customObj = {
                id: result?.resultNotParsed?.content?.aweme_id,
                images: imagesArray,
                audio: result?.resultNotParsed?.content?.music?.play_url?.uri
            }
            return res.json({
                success: true,
                message: "your result is ready",
                data: customObj
            })
        }
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
})

module.exports = router;