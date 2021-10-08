const fs = require('fs').promises;

class HashLocal {

    constructor() {
        this._path = "./postings.json"
        this.enc = "utf8"
        this.posts = {}
    }

    set path(path) {
        this._path = path
    }

    // Fetch hash for Lever "target" (URL path)
    async fetchHash(target) {
        try {
            const postsData = await fs.readFile(this._path, this.enc);
            this.posts = JSON.parse(postsData);
            return target in this.posts ? this.posts[target] : null;
        } catch (e) {
            return {}
        }
    }

    // Update stored hashes
    async updateHash(target, hash) {
        try {
            this.posts[target] = hash;
            await fs.writeFile(this._path, JSON.stringify(this.posts, null, 2), this.enc);
        } catch (e) {
            console.error(e)
        }
    }
}

module.exports = new HashLocal();