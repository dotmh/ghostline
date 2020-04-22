const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const JSEXT = '.js';
const PARTIALS = Symbol('type.partials');
const HELPERS = Symbol('type.helpers');

const process = [PARTIALS, HELPERS];

module.exports = (_options = {}) => {
	const options = {
		..._options, ...{
			partials: 'partials',
			pattern: '.hbs',
			helpers: 'helpers'
		}
	};

	const walk = (type, root, directory, top) => {
		top = top || directory;

		if (top.endsWith('/') === false) {
			top = `${top}/`;
		}

		const filePattern = type === PARTIALS ? options.pattern : JSEXT;
		const files = fs.readdirSync(directory);

		files.forEach(file => {
			const fullPath = path.join(directory, file);
			if (fs.statSync(fullPath).isDirectory()) {
				walk(type, root, fullPath, directory);
			} else if (file.endsWith(filePattern)) {
				const name = fullPath.replace(top, '').replace(filePattern, '');
				const fsPath = path.join(root, fullPath);
				switch (type) {
					case PARTIALS:
					{
						const content = fs.readFileSync(fsPath, 'utf-8');
						handlebars.registerPartial(name, content);
						break;
					}

					case HELPERS:
					{
						handlebars.registerHelper(name, require(fsPath));
						break;
					}

					default:
					{
						throw new Error(`Can not handle ${type}`);
					}
				}
			}
		});
	};

	return (files, metalsmith, done) => {
		process.forEach(type => {
			let directory;
			switch (type) {
				case PARTIALS: {
					directory = options.partials;
					break;
				}

				case HELPERS: {
					directory = options.helpers;
					break;
				}

				default: {
					throw new Error(`Can not handle ${type}`);
				}
			}

			walk(type, metalsmith._directory, directory);
		});
		done();
	};
};
