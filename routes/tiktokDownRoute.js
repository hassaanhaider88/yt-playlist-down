const express = require("express");
// const tiktokdl = require('@faouzkk/tiktok-dl');
const Tiktok = require("@tobyg74/tiktok-api-dl")
const fs = require("fs");
const path = require("path");

const router = express.Router();
const TikTokUrlValidator = require("../utils/TikTokUrlValidation");
const { createRequestTempFolder, cleanupTempFolder } = require("../utils/tempManager");
const { downloadImages, downloadFile } = require("../utils/fileDownloader");
const { buildSlideshowVideo } = require("../services/slideshowBuilder");


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
    const { tiktokUrl } = req.body;
    if (!tiktokUrl) {
        return res.status(400).json({
            success: false,
            message: "please provide Valid tiktok URL",
        });
    }

    if (!TikTokUrlValidator(tiktokUrl)) {
        return res.status(400).json({
            success: false,
            message: "invalid tiktok URL",
        });
    }

    let tempFolder = null;
    try {

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

        tempFolder = await createRequestTempFolder();

        // 3) Download images + audio in parallel
        const [downloadedImages, downloadedAudioPath] = await Promise.all([
            downloadImages(customObj.images, tempFolder.imagesDir),
            customObj.audio
                ? downloadFile(customObj.audio, path.join(tempFolder.audioDir, "audio.mp3"))
                : Promise.resolve(null),
        ]);
        // 4) Build the sliding slideshow video
        const outputPath = path.join(tempFolder.outputDir, `${customObj.id}.mp4`);
        await buildSlideshowVideo(downloadedImages, downloadedAudioPath, outputPath);

        // 5) Stream the finished video back to the client, then clean up
        //    the whole tmp/<requestId> folder (images + audio + video).
        return res.download(outputPath, `${customObj.id}.mp4`, async (err) => {
            if (err) {
                console.error("[download-images] failed sending video:", err.message);
            }
            await cleanupTempFolder(tempFolder.rootDir);
        });
    } catch (error) {
        console.error("[download-images] error:", error);
        if (tempFolder) {
            await cleanupTempFolder(tempFolder.rootDir);
        }
        return res.json({
            success: false,
            message: error.message
        })
    }
})

module.exports = router;