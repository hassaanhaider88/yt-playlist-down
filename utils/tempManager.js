const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const BASE_TMP_DIR = path.join(process.cwd(), "../tmp");

async function createRequestTempFolder() {
    const requestId = crypto.randomUUID();
    const rootDir = path.join(BASE_TMP_DIR, requestId);
    const imagesDir = path.join(rootDir, "images");
    const audioDir = path.join(rootDir, "audio");
    const outputDir = path.join(rootDir, "output");

    await Promise.all([
        fs.mkdir(imagesDir, { recursive: true }),
        fs.mkdir(audioDir, { recursive: true }),
        fs.mkdir(outputDir, { recursive: true }),
    ]);

    return { requestId, rootDir, imagesDir, audioDir, outputDir };
}

async function cleanupTempFolder(rootDir) {
    if (!rootDir) return;
    try {
        await fs.rm(rootDir, { recursive: true, force: true });
    } catch (err) {
        console.error(`[tempManager] failed to cleanup ${rootDir}:`, err.message);
    }
}

async function purgeAllTempFolders() {
    try {
        await fs.rm(BASE_TMP_DIR, { recursive: true, force: true });
        await fs.mkdir(BASE_TMP_DIR, { recursive: true });
    } catch (err) {
        console.error("[tempManager] failed to purge base tmp dir:", err.message);
    }
}

module.exports = { createRequestTempFolder, cleanupTempFolder, purgeAllTempFolders, BASE_TMP_DIR };