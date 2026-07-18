function TikTokUrlValidator(urlString) {
    try {
        const url = new URL(urlString);
        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
            return false;
        }
        const validHostnames = ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com', 'm.tiktok.com'];
        if (!validHostnames.includes(url.hostname)) {
            return false;
        }
        
        return true;

    } catch (error) {
        return false;
    }
}



module.exports = TikTokUrlValidator 