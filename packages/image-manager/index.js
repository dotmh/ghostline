const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

/*
 * Usage
 * -----
 * {{img "about/background.jpg" "background"}}
 */

module.exports = (_options = {}) => {
	const options = {
		...{
			imageFolder: '',
			imagePath: ''
		},
		..._options
	};

	return (files, metalsmith, done) => {
		const exists = filepath => {
			let result;
			try {
				result = fs.statSync(filepath);
			} catch (error) { // eslint-disable-line no-unused-vars
				result = {
					isFile() {
						return false;
					}
				};
			}

			return result.isFile();
		};

		const resolveImage = img => {
			return [options.imageFolder, img].filter(Boolean).join('/');
		};

		const getWebP = image => {
			const webp = `${image.split('.')[0]}.webp`;
			const webpPath = path.join(options.imagePath, webp);

			if (exists(webpPath)) {
				return webp[0] === '/' ? webp : `/${webp}`;
			}

			return false;
		};

		handlebars.registerHelper('img', (...args) => {
			const [img, alt, cssClass] = args;

			const image = resolveImage(img);
			const webp = getWebP(image);
			const source = [];

			if (webp) {
				source.push(`<source type="image/webp" srcset="${webp}">`);
			}

			/* eslint-disable no-negated-condition */
			return new handlebars.SafeString(`
				<picture>
					${source.join('\n')}
					<img src="${image[0] !== '/' ? `/${image}` : image}" alt="${alt || 'Some image'}"${cssClass ? ` class="${cssClass}"` : ''}>
				</picture>
			`);
			/* eslint-enable no-negated-condition */
		});

		handlebars.registerHelper('imgBG', (...args) => {
			const [img] = args;
			const image = resolveImage(img);
			const backgrounds = [`background-image:url('${image}');`];

			return new handlebars.SafeString(backgrounds.join(' '));
		});

		done();
	};
};
