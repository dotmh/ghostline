const path = require('path');
const minimatch = require('minimatch');

module.exports = (_options = {}) => {
	const options = {...{
		layout: 'default'
	}, ..._options};

	return (files, metalsmith, done) => {
		Object.entries({...files})
			.filter(([, payload]) => 'galleries' in payload)
			.forEach(([key, payload]) => {
				Object.entries(payload.galleries).forEach(([name, folder]) => {
					const galleryHTMLPath = path.join(key.split('.')[0], name);
					const gallery = Object.entries({...files})
						.filter(([imageKey]) => minimatch(imageKey, `${folder}/@(*.jpeg|*.jpg|*.png)`));

					const html = gallery.map(([imageKey, value]) => {
						const filename = path.basename(imageKey).split('.')[0];
						const metalsmithKey = path.join(galleryHTMLPath, `${filename}.html`);
						return [metalsmithKey, {
							parent: payload,
							title: filename,
							contents: Buffer.from('hello'),
							layout: options.layout,
							section: payload.section,
							stats: value.stats,
							header: payload.header,
							image: `/${imageKey}`,
							path: `/${metalsmithKey}`
						}];
					});

					html.forEach(([htmlKey, value], index) => {
						/* eslint-disable no-negated-condition */
						value.next = typeof (html[index + 1]) !== 'undefined' ? html[index + 1][1] : null;
						value.prev = typeof (html[index - 1]) !== 'undefined' ? html[index - 1][1] : null;
						/* eslint-enable no-negated-condition */

						value.first = html[0][1];
						value.last = html[html.length - 1][1];

						files[htmlKey] = value;
					});

					files[key][name] = html.map(([, value]) => value);
				});
			});

		done();
	};
};
