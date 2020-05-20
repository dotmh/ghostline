const path = require('path');
const fs = require('fs');
const minimatch = require('minimatch');
const Vibrant = require('node-vibrant');
const handlebars = require('handlebars');

const GLOB = '**/@(*.jpg|*.png|*.jpeg)';

module.exports = (_options = {}) => {
	const options = {
		...{
			sourceDirectory: '',
			outfile: ''
		},
		..._options
	};

	const storeOutFile = (outpath, data) => {
		fs.writeFileSync(outpath, JSON.stringify(data, null, 2));
	};

	const addHandleBarsHelper = metalsmith => {
		handlebars.registerHelper('colorsFor', (image, varient) => {
			if (image in metalsmith._metadata.imageColors &&
				varient in metalsmith._metadata.imageColors[image]) {
				return metalsmith._metadata.imageColors[image][varient].join(',');
			}

			return null;
		});
	};

	const loadFromCache = (output, files) => {
		if (fs.statSync(output).isFile()) {
			const filterFiles = Object.keys({...files}).filter(key => minimatch(key, GLOB));
			const cache = JSON.parse(fs.readFileSync(output, 'utf-8'));
			const cacheKeys = Object.keys(cache);

			if (cacheKeys.length !== filterFiles.length) {
				return false;
			}

			const changed = filterFiles.filter(key => cacheKeys.includes(key) === false);

			if (changed.length > 0) {
				return false;
			}

			return cache;
		}

		return false;
	};

	return (files, metalsmith, done) => {
		const cache = loadFromCache(path.resolve(metalsmith._directory, options.outfile), files);
		if (cache === false) {
			const keys = [];
			const promises = Object.keys({...files})
				.filter(key => minimatch(key, GLOB))
				.map(key => {
					const imagePath = path.resolve(metalsmith._directory, options.sourceDirectory, key);
					keys.push(key);
					return Vibrant.from(imagePath).getPalette();
				});

			/* eslint-disable promise/prefer-await-to-then */
			Promise.all(promises).then(imagePallets => {
				const imageColors = Object.fromEntries(imagePallets.map((imagePallet, index) => {
					return [
						keys[index], Object.fromEntries(
							Object.entries(imagePallet)
								.filter(([, swatch]) => swatch && typeof swatch.getRgb === 'function')
								.map(([name, swatch]) => {
									return [name, swatch.getRgb().map(Math.floor)];
								})
						)
					];
				}));
				/* eslint-enable promise/prefer-await-to-then */

				if (options.outfile) {
					storeOutFile(path.resolve(metalsmith._directory, options.outfile), imageColors);
				}

				metalsmith._metadata = {
					...metalsmith._metadata,
					imageColors
				};

				addHandleBarsHelper(metalsmith);

				done();
			}).catch(error => {
				console.error('Failed to process Images Colors', error);
				done();
			});
		} else {
			metalsmith._metadata = {
				...metalsmith._metadata,
				imageColors: cache
			};
			addHandleBarsHelper(metalsmith);
			done();
		}
	};
};
