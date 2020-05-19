module.exports = () => {
	const INCLUDE_KEY = 'includes';

	return (files, metalsmith, done) => {
		Object.entries({...files})
			.forEach(([key, payload]) => {
				if (INCLUDE_KEY in payload && Array.isArray(payload[INCLUDE_KEY])) {
					const includeMap = {};
					payload.includes.forEach(file => {
						if (file in files) {
							const name = file.replace('/', '__').replace(/\..+$/, '');
							includeMap[name] = files[file];
						}
					});
					files[key][INCLUDE_KEY] = includeMap;
				}
			});
		done();
	};
};
