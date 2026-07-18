const express = require("express")
const insta = require('insta-reel-search')
const router = express.Router();
const InstaURLValidator = require("../utils/InstaURLValidator");



router.post("/download-video", async (req, res) => {
    try {
        const { instaUrl } = req.body;
        if (!instaUrl) {
            return res.json({
                success: false,
                message: "please provide Valid tiktok URL"
            })
        }
        if (InstaURLValidator(instaUrl)) {
            console.log(instaUrl)
            const reel = await insta.search(instaUrl);
            console.log(reel);
            return res.json({
                success: true,
                message: "your result is ready",
                data: reel
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
        const { instaUrl } = req.body;
        if (!instaUrl) {
            return res.json({
                success: false,
                message: "please provide Valid tiktok URL"
            })
        }
        if (InstaURLValidator(instaUrl)) {

            // const imagesArray = [
            //     ...new Set(
            //         (result?.resultNotParsed?.content?.image_post_info?.images ?? [])
            //             .map((img) =>
            //                 img.display_image?.url_list?.find((url) => url.includes("p16"))
            //             )
            //             .filter(Boolean)
            //     ),
            // ];
            // const customObj = {
            //     id: result?.resultNotParsed?.content?.aweme_id,
            //     images: imagesArray,
            //     audio: result?.resultNotParsed?.content?.music?.play_url?.uri
            // }
            return res.json({
                success: true,
                message: "your result is ready",
                data: "customObj"
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