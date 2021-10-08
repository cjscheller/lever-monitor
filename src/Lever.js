const axios = require('axios');
const cheerio = require('cheerio');
const md5 = require('md5');

const HashLocal = require('./HashLocal');
const HashDynamo = require('./HashDynamo');
const notifier = require('./Notifier');

class Lever {

    constructor(target = "") {
        this.target = target;
        this.hashMgr = process.env.LEVER_RUNTIME === "remote" ? HashDynamo : HashLocal;
    }

    // Check target Lever URL for changes to job postings 
    async checkTarget(target = "") {
        const leverTarget = target || this.target;
        if (!leverTarget) throw "Error: Must specify 'target' parameter";

        const posts = await this.fetchPosts(leverTarget);
        const hash = md5(posts);
        return await this.checkHash(leverTarget, hash);
    }

    // Fetch job postings from Lever, return scraped jobs w/ team and location
    async fetchPosts(target) {
        try {
            const url = `https://jobs.lever.co/${target}`
            const response = await axios(url);
            const html = response.data;
            const $ = cheerio.load(html);

            const postings = $('div.posting');
            return postings.get().map(el => {
                return {
                    title: $(el).find('h5[data-qa="posting-name"]').text().trim(),
                    location: $(el).find('div.posting-categories span.sort-by-location').text().trim(),
                    team: $(el).find('div.posting-categories span.sort-by-team').text().trim(),
                }
            });
        } catch (e) {
            throw e;
        }
    }

    // Check for changes to job postings by comparing md5 hash to hash stored
    async checkHash(target, hash) {
        try {
            const storedHash = await this.hashMgr.fetchHash(target);
            if (hash === storedHash) {
                return true;
            } else {
                await this.hashMgr.updateHash(target, hash);
                await notifier.notify(target);
                return false;
            }
        } catch (e) {
            throw e
        }
    }
}

module.exports = Lever;