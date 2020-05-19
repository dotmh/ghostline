module.exports = options => {
	options = {
		...{
			sort: {
				list: null,
				featured: null
			}
		}, ...options
	};

	const sections = {};
	const featured = {};

	const featuredMetaKey = 'features';
	const listMetaKey = 'list';

	return (files, metalsmith, done) => {
		Object.entries({...files})
			.filter(([, data]) => 'section' in data)
			.forEach(([key, data]) => {
				const sectionsData = Array.isArray(data.section) === false ?
					[data.section] : data.section;

				sectionsData.forEach(sectionName => {
					sections[sectionName] = sections[sectionName] || [];
					featured[sectionName] = featured[sectionName] || [];

					const result = {
						key,
						...data
					};

					if (!('role' in data) || ('role' in data && data.role.startsWith('index') === false)) {
						if ('featured' in data && data.featured === true) {
							featured[sectionName].push(result);
						} else {
							sections[sectionName].push(result);
						}
					}
				});
			});

		Object.entries({...files})
			.filter(([, data]) => 'role' in data && data.role.startsWith('index'))
			.forEach(([key, data]) => {
				if ('section' in data) {
					const sectionsData = Array.isArray(data.section) === false ?
						[data.section] : data.section;

					sectionsData.forEach(section => {
						const [, indexFor] = data.role.split('.');
						const listMetaKeyName =
							sectionsData.length > 1 ? `${listMetaKey}_${section}` : listMetaKey;
						const featuresMetaKeyName =
							sectionsData.length > 1 ? `${featuredMetaKey}_${section}` : featuredMetaKey;
						let list;
						let featuredArr;

						if (!indexFor || indexFor === section) {
							list = sections[section] || [];
							featuredArr = featured[section] || [];

							if (typeof options.sort.list === 'function') {
								list = list.sort(options.sort.list);
							}

							if (typeof options.sort.featured === 'function') {
								featuredArr = featuredArr.sort(options.sort.featured);
							}

							files[key][listMetaKeyName] = list;
							files[key][featuresMetaKeyName] = featuredArr;
						}
					});
				}
			});

		done();
	};
};
