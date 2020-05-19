const fs = require('fs');
const path = require('path');

const yaml = require('js-yaml');

const loadFile = file => {
	const ext = path.extname(file);
	const raw = fs.readFileSync(file, 'utf-8');
	let data;

	switch (ext) {
		case '.yaml':
		case '.yml':
			data = yaml.safeLoad(raw);
			break;
		case '.json':
		default:
			data = JSON.parse(raw);
			break;
	}

	return data;
};

const metaLoader = (...args) => {
	let toLoad = args;
	let meta = {};
	if (args.length === 1) {
		if (Array.isArray(args[0])) {
			toLoad = args[0];
		}
	}

	toLoad.forEach(file => {
		if (typeof file === 'object') {
			file.process = file.process || (data => data);
			meta[file.as] = file.process(loadFile(file.from));
		} else {
			meta = {...meta, ...loadFile(file)};
		}
	});

	return {...meta, ...timeMetadata()};
};

const timeMetadata = () => {
	const meta = {};
	const now = new Date();

	meta.today = now;
	meta.year = now.getFullYear();
	meta.date = [now.getFullYear(), (now.getMonth() + 1), now.getDate()]
		.map(value => `${value}`.padStart(2, '0'))
		.join('/');
	meta.time = [now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()]
		.map(value => `${value}`.padStart(2, '0'))
		.join(':');

	return meta;
};

module.exports.metaPlugin = () => {
	return (files, metalsmith, done) => {
		Object.entries({...files})
			.filter(([, payload]) => 'meta' in payload)
			.forEach(([key, payload]) => {
				const data = metaLoader(payload.meta.map(file => {
					if (typeof file === 'object') {
						file.form = path.join(metalsmith._directory, file.from);
					} else {
						file = path.join(metalsmith._directory, file);
					}

					return file;
				}));
				files[key] = {...files[key], ...data};
			});

		done();
	};
};

module.exports.metaLoader = metaLoader;
