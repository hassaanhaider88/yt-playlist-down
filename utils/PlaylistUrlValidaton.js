function playlistUrlValidation(urlString) {
    try {
        const url = new URL(urlString);
        if (!url.hostname.includes('youtube.com')) {
            return false;
        }
        const isPlaylistPath = url.pathname === '/playlist' || url.pathname === '/watch';
        const hasListId = url.searchParams.has('list');

        return isPlaylistPath && hasListId;

    } catch (error) {
        return false;
    }
}

module.exports = playlistUrlValidation 