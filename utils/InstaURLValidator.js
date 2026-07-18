function InstaURLValidator(urlString) {
    try {
        const url = new URL(urlString);
        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
            return false;
        }
        const validHostnames = ['instagram.com', 'www.instagram.com', 'vm.instagram.com', 'vt.instagram.com', 'm.instagram.com'];
        if (!validHostnames.includes(url.hostname)) {
            return false;
        }

        return true;

    } catch (error) {
        return false;
    }
}



module.exports = InstaURLValidator 