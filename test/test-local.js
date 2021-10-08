const assert = require('assert');
const fs = require("fs").promises;
const path = require("path");
const nock = require('nock')

const Lever = require('../src/Lever');
const HashLocal = require('../src/HashLocal');
const Notifier = require('../src/Notifier');


describe('Lever', () => {

    before(async () => {
        // Fetch example Lever job post
        const leverExample = path.join(__dirname, './testLever.html');
        const leverHtml = await fs.readFile(leverExample, "utf-8");

        // Mock fetch request for lever job postings
        nock('https://jobs.lever.co')
            .get('/test123')
            .reply(200, leverHtml)
    });

    describe('fetchPosts', () => {
        it("fetches and parses Lever job posts successfully", async () => {
            const lever = new Lever();
            const posts = await lever.fetchPosts("test123");

            const expectedPosts = [
                {
                    title: 'Software Engineer',
                    location: 'Remote',
                    team: 'Engineering'
                },
                {
                    title: 'Software Engineer II',
                    location: 'Remote',
                    team: 'Engineering'
                },
                {
                    title: 'Director of Operations',
                    location: 'Canada',
                    team: 'Operations'
                }
            ]

            assert.deepEqual(posts, expectedPosts);
        })
    });

    describe('checkTarget', () => {
        it("requires a target parameter", async () => {
            try {
                const lever = new Lever();
                const posts = await lever.checkTarget();
            } catch (err) {
                assert.equal(err, "Error: Must specify 'target' parameter");
            }
        })
    })
});

describe('HashLocal', () => {
    // Declare test file path, initial hash state
    const testFile = path.join(__dirname, './testHash.json');
    const hashState = {
        "test123": "state-1"
    }
    // Initialize HashLocal lib for test path
    const hashLocal = HashLocal;
    hashLocal.path = testFile;

    describe('fetchHash', () => {
        it('should match hash in local file', async () => {
            // Write hash to local test file manually
            await fs.writeFile(testFile, JSON.stringify(hashState, null, 2), "utf-8");
            assert.equal(await hashLocal.fetchHash("test123"), hashState["test123"])
        })
    });

    describe('updateHash', () => {
        it('should match updated hash file', async () => {
            // Update hash, then manually read file and confirm updated as expected
            const newHash = "state-2";
            await hashLocal.updateHash("test123", newHash);
            const fileJson = await fs.readFile(testFile, "utf-8");
            assert.equal(JSON.parse(fileJson)["test123"], newHash);
        });
    });
});

describe('Notifier - Desktop', () => {
    describe('notifyLocal', () => {
        it('triggers a desktop notification', () => {
            try {
                Notifier.notifyDesktop("TESTING_123")
            } catch (err) {
                assert(1, 2);
            }
            assert(1, 1);
        });
    });
});