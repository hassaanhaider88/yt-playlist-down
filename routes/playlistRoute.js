const express = require("express");
const { create } = require('youtube-dl-exec');
const playlistUrlValidation = require("../utils/PlaylistUrlValidaton")

const router = express.Router();
const youtubedl = process.env.YTDLP_PATH
    ? create(process.env.YTDLP_PATH)
    : require("youtube-dl-exec");
router.post("/get-playlist-data", async (req, res) => {
    try {
        const { playlistUrl } = req.body;
        if (!playlistUrl) {
            return res.json({
                success: false,
                message: "please provide Valid playlistUrl"
            })
        }
        if (playlistUrlValidation(playlistUrl)) {
            const data = await youtubedl(playlistUrl, {
                dumpSingleJson: true,
            });

            const customObj = {
                id: data?.id,
                title: data?.title,
                availability: data?.availability,
                description: data?.description,
                description: data?.description,
                mainThumbnail: data?.thumbnails[0],
                lastModified: data?.modified_date,
                viewCount: data?.view_count,
                playlistCount: data?.playlist_count, // number of video in one playlist
                channelName: data?.channel,
                channelUrl: data?.channel_url,
                entries: data?.entries.map((entry) => { // this will be for each single video in whole pl
                    return {
                        thumbnail: entry?.thumbnail,
                        description: entry?.description,
                        duration: entry?.duration,
                        viewCount: entry?.view_count,
                        webpage_url: entry?.webpage_url,
                        likeCount: entry?.like_count,
                        availability: entry?.availability,
                        requestedDownloads: entry?.requested_downloads[0],
                    }
                }),
                _version: {
                    version: data._version.version,
                    repository: data._version.repository,
                }
            }
            return res.json({
                success: true,
                message: "Playlist data Fetch Successfully..",
                data: customObj
            })
        } else {
            return res.json({
                success: false,
                message: "please provide Valid playlistUrl"
            })
        }
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message
        })
    }
})


module.exports = router;