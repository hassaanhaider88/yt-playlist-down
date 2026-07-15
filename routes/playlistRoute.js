const express = require("express");
const playlistUrlValidation = require("../utils/PlaylistUrlValidaton")
const router = express.Router();

router.post("/get-metadata", (req, res) => {
    try {
        const { playlistUrl } = req.body;
        if (!playlistUrl) {
            return res.json({
                sucess: false,
                message: "please provide Valid playlistUrl"
            })
        }
        if (playlistUrlValidation(playlistUrl)) {
            return res.send("please waite")
        } else {
            return res.json({
                sucess: false,
                message: "please provide Valid playlistUrl"
            })
        }
    } catch (error) {
        return res.json({
            sucess: false,
            message: error.message
        })
    }
})


module.exports = router;