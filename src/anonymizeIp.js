const ip = require('ip');

const anonymizeIp = remoteAddress => {
	if (ip.isV4Format(remoteAddress)) {
		const parts = remoteAddress.split('.');
		return `${parts[0]}.${parts[1]}.0.0`;
	}
	if (ip.isV6Format(remoteAddress)) {
		return (/::/.test(remoteAddress))
			? remoteAddress.replace(/(::).*/, '$1')
			: remoteAddress.replace(/([a-f0-9]{1,4}:?){4}$/, ':');
	}
	return '::';
};

module.exports = anonymizeIp;
