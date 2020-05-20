const parseDateTime = dateTime => {
	if (!dateTime) {
		return new Date();
	}

	const [date, time] = dateTime.split(' ');
	const [year, month, day] = date.split('/').map(Number);
	const [hour, min, sec] = time ? time.split(':').map(Number) : [0, 0, 0];

	return new Date(Date.UTC(year, month - 1, day, hour, min, sec));
};

const generateToday = () => {
	const now = new Date();
	return new Date(
		Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
			now.getUTCHours(),
			now.getUTCMinutes(),
			now.getUTCSeconds()
		)
	);
};

const count = (now, from) => {
	const duration = now.getTime() - from.getTime();

	const sec = Math.floor(duration / 1000);
	const min = Math.floor(sec / 60);
	const hours = Math.floor(min / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const years = Math.floor(weeks / 52);

	return {
		sec: sec % 60,
		min: min % 60,
		hours: hours % 24,
		days: days % 7,
		weeks: weeks % 52,
		years
	};
};

const zeroFill = what => {
	return Object.fromEntries(
		Object.entries(what).map(([key, value]) => {
			return [key, `${value}`.padStart(2, '0')];
		})
	);
};

module.exports = {
	parseDateTime,
	generateToday,
	count,
	zeroFill
};
