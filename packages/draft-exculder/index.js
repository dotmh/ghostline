module.exports = () => {
	return (files, metalsmith, done) => {
		Object.entries({...files})
			.filter(([, payload]) => 'draft' in payload && payload.draft)
			.forEach(([key]) => {
				delete files[key];
			});

		done();
	};
};
