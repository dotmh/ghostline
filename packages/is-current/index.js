const minimatch = require('minimatch');

const extentions = ['md', 'html', 'htm'];

module.exports = (_options = {}) => {
	const options = {..._options, ...{
		extentions
	}};

	return (files, metalsmith, done) => {
		const pattern = `**/@(${options.extentions.map(ext => `*.${ext}`).join('|')})`;
		Object.entries({...files})
			.filter(([key]) => minimatch(key, pattern))
			.forEach(([key, payload]) => {
				files[key].pageMenu = [...metalsmith._metadata.menu].map(item => {
					return {...item};
				});
				files[key].pageMenu.map(item => {
					const pageSection = Array.isArray(payload.section) === false ? [payload.section] : payload.section;
					if (pageSection.includes(item.section)) {
						item.isActive = true;
					}

					return item;
				});
			});

		done();
	};
};

module.exports.patterns = extentions;

