const minimatch = require('minimatch');
const handlebars = require('handlebars');

const extentions = ['html', 'htm', 'hbs'];
const skip = ['contents', 'mode', 'stats'];

module.exports = (_options = {}) => {
	const options = {..._options, ...{
		extentions
	}};

	const clean = payload => {
		return Object.fromEntries(
			Object.entries(payload)
				.filter(([key]) => skip.includes(key) === false)
		);
	};

	return (files, metalsmith, done) => {
		const pattern = `**/@(${options.extentions.map(ext => `*.${ext}`).join('|')})`;

		Object.entries({...files})
			.filter(([key]) => minimatch(key, pattern))
			.forEach(([key, payload]) => {
				const contents = payload.contents.toString('utf-8');
				const template = handlebars.compile(contents);
				files[key].contents = Buffer.from(template({
					...metalsmith._metadata,
					...clean(payload)
				}));
			});
		done();
	};
};

module.exports.patterns = extentions;
