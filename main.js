const Lever = require('./src/Lever.js');
const argv = require('yargs-parser')(process.argv.slice(2));

async function main() {
	// From CLI, `--target` parameter required
	if (!argv.target) {
		throw "Error: Must specify `--target` option"
	}

	const targetList = Array.isArray(argv.target) ? argv.target : [argv.target];
	const lever = new Lever();
	targetList.forEach(async target => {
		lever.checkTarget(target).catch(err => { throw err });
	});
}

main().catch(console.error)