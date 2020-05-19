module.exports = () => {
	return (files, metalsmith, done) => {
		const sections = {};

		const query = query => {
			if (!query) {
				return null;
			}

			let base = sections;
			if (typeof base === 'string') {
				return base;
			}

			query.split('.').forEach(part => {
				base = base[part];
			});
			return base;
		};

		// Find the top level of each section
		Object.values({...files})
			.filter(value => {
				return 'section' in value &&
					'role' in value &&
					value.role === 'index';
			})
			.forEach(value => {
				sections[value.section] = value;
			});

		Object.entries({...files})
			.filter(([, value]) => 'inherit' in value)
			.forEach(([key, payload]) => {
				payload.inherit.forEach(({as, from}) => {
					files[key][as] = query(from);
				});
			});

		done();
	};
};
