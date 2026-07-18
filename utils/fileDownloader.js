const fs = require("fs");
const path = require("path");
const axios = require("axios");

function downloadFile(url, destPath, { timeout = 30000 } = {}) {
    return new Promise((resolve, reject) => {
        axios({
            method: "GET",
            url,
            responseType: "stream",
            timeout,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
            },
        })
            .then((response) => {
                const writer = fs.createWriteStream(destPath);
                let hasError = false;

                writer.on("error", (err) => {
                    hasError = true;
                    writer.close();
                    reject(err);
                });

                writer.on("close", () => {
                    if (!hasError) resolve(destPath);
                });

                response.data.on("error", (err) => {
                    hasError = true;
                    writer.close();
                    reject(err);
                });

                response.data.pipe(writer);
            })
            .catch(reject);
    });
}

async function downloadImages(imageUrls, imagesDir) {
    const settled = await Promise.allSettled(
        imageUrls.map((url, index) => {
            const fileName = `${String(index + 1).padStart(3, "0")}.jpg`;
            const destPath = path.join(imagesDir, fileName);
            return downloadFile(url, destPath).then(() => destPath);
        })
    );

    const downloaded = [];
    settled.forEach((result, index) => {
        if (result.status === "fulfilled") {
            downloaded.push(result.value);
        } else {
            console.error(
                `[fileDownloader] image #${index + 1} failed to download:`,
                result.reason?.message
            );
        }
    });

    return downloaded;
}

module.exports = { downloadFile, downloadImages };