const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath("C:/Users/sanna/AppData/Local/Microsoft/WinGet/Packages/yt-dlp.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-N-124716-g054dffd133-win64-gpl/bin/ffmpeg.exe");

const DEFAULT_OPTIONS = {
    width: 1080,
    height: 1920,
    fps: 30,
    imageDuration: 2.5,
    transitionDuration: 0.8,
    transitionType: "slideright",
};

function buildImageFilter(inputIndex, width, height, fps, label) {
    return (
        `[${inputIndex}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,` +
        `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black,` +
        `setsar=1,fps=${fps},format=yuv420p[${label}]`
    );
}

function buildXfadeChain(imageCount, imageDuration, transitionDuration, transitionType) {
    const filters = [];
    let previousLabel = "v0";
    let cumulativeOffset = 0;

    for (let i = 1; i < imageCount; i++) {
        const currentLabel = `v${i}`;
        const outLabel = i === imageCount - 1 ? "vout" : `vx${i}`;
        cumulativeOffset = i * (imageDuration - transitionDuration);

        filters.push(
            `[${previousLabel}][${currentLabel}]xfade=transition=${transitionType}:` +
            `duration=${transitionDuration}:offset=${cumulativeOffset.toFixed(3)}[${outLabel}]`
        );
        previousLabel = outLabel;
    }

    const totalDuration = imageCount * imageDuration - (imageCount - 1) * transitionDuration;

    return {
        filters,
        outputLabel: imageCount === 1 ? "v0" : previousLabel,
        totalDuration,
    };
}


function buildSlideshowVideo(imagePaths, audioPath, outputPath, options = {}) {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const { width, height, fps, imageDuration, transitionDuration, transitionType } = opts;

    if (!imagePaths || imagePaths.length === 0) {
        return Promise.reject(new Error("At least one image is required to build a slideshow"));
    }

    return new Promise((resolve, reject) => {
        const command = ffmpeg();

        // 1) One looped, time-limited input per image.
        imagePaths.forEach((imgPath) => {
            command.input(imgPath).inputOptions(["-loop", "1", "-t", `${imageDuration}`]);
        });

        const hasAudio = Boolean(audioPath);
        if (hasAudio) {
            command.input(audioPath).inputOptions(["-stream_loop", "-1"]);
        }


        const perImageFilters = imagePaths.map((_, i) =>
            buildImageFilter(i, width, height, fps, `v${i}`)
        );
        const { filters: xfadeFilters, outputLabel, totalDuration } = buildXfadeChain(
            imagePaths.length,
            imageDuration,
            transitionDuration,
            transitionType
        );

        const audioIndex = imagePaths.length; // audio is always the last input
        const audioFadeStart = Math.max(totalDuration - 1, 0);
        const audioFilters = hasAudio
            ? [
                `[${audioIndex}:a]atrim=0:${totalDuration},asetpts=PTS-STARTPTS,` +
                `afade=t=out:st=${audioFadeStart}:d=1[aout]`,
            ]
            : [];

        command.complexFilter([...perImageFilters, ...xfadeFilters, ...audioFilters]);

        command.outputOptions([
            "-map", `[${outputLabel}]`,
            ...(hasAudio ? ["-map", "[aout]"] : []),
            "-t", `${totalDuration}`,
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "veryfast",
            "-crf", "23",
            ...(hasAudio ? ["-c:a", "aac", "-b:a", "128k"] : []),
            "-movflags", "+faststart",
        ]);

        command
            .on("error", (err, _stdout, stderr) => {
                console.error("[ffmpeg] failed:", err.message);
                if (stderr) console.error(stderr);
                reject(err);
            })
            .on("end", () => resolve(outputPath))
            .save(outputPath);
    });
}

module.exports = { buildSlideshowVideo };