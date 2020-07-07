const {parseDateTime, generateToday, count, zeroFill} = require('./time-functions');

module.exports = (handlebars, _options = {}) => {
	const options = {
		...{
			countdowns: {
				// Work: "yyyy/mm/dd hh:mm:ss"
			}
		}, ..._options
	};

	return (files, metalsmith, done) => {
		metalsmith._metadata.countdowns = {};
		Object.entries(options.countdowns).forEach(([key, value]) => {
			metalsmith._metadata.countdowns[key] = {
				...zeroFill(count(generateToday(), parseDateTime(value))),
				time: parseDateTime(value).getTime()
			};
		});

		handlebars.registerHelper('timer', (dateString, options) => {
			const context = {
				time: parseDateTime(dateString).getTime(),
				...zeroFill(count(generateToday(), parseDateTime(dateString)))
			};

			return options.fn(context);
		});

		done();
	};
};
