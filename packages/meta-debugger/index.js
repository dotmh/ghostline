const minimatch = require('minimatch');

module.exports = (_options = {}) => {
	const options = {
		...{
			pattern: null,
			show: true,
			global: true
		}, ..._options
	};

	return (files, metalsmith, done) => {
		if (options.show && options.global) {
			console.log('Global:', metalsmith._metadata);
		}

		Object.entries({...files})
			.filter(([key]) => options.pattern ? minimatch(key, options.pattern) : true)
			.forEach(([key, payload]) => {
				if (options.show) {
					console.log(`Payload: ${key}`, payload);
				}
			});

		done();
	};
};
