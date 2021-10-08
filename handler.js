const Lever = require('./src/Lever.js');

module.exports.main = _ => {
	const targetList = process.env.LEVER_TARGETS;
	const lever = new Lever();
	targetList.split(',').forEach(async target => {
		lever.checkTarget(target).catch(console.error);
	});
}