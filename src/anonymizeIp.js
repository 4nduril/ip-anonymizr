const { v4, v6 } = require('ip-regex');

const v4Mapper = mask => (byte, idx) =>
	(parseInt(byte, 10) & mask[idx]).toString();

const anonymizeIp = remoteAddress => {
	if (v4().test(remoteAddress)) {
		const mask = [255, 255, 0, 0];
		return remoteAddress.split('.')
			.map(v4Mapper(mask))
			.join('.');
	}
	if (v6().test(remoteAddress)) {
		return (/::/.test(remoteAddress))
			? remoteAddress.replace(/(::).*/, '$1')
			: remoteAddress.replace(/([a-f0-9]{1,4}:?){4}$/, ':');
	}
	return '::';
};

module.exports = anonymizeIp;
