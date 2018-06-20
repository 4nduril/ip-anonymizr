import { v4, v6 } from 'ip-regex';

const v4Mapper = mask => (byte, idx) =>
	(parseInt(byte, 10) & mask[idx]).toString();

const v6Mapper = mask => (byte, idx) =>
	(parseInt(byte, 16) & parseInt(mask[idx], 16)).toString(16);

const cutOuterColons = s => {
	const cutFirst = s.startsWith(':') ? s.slice(1): s;
	return cutFirst.endsWith(':') ? cutFirst.slice(0, cutFirst.length - 1) : cutFirst;
};

const expandV6 = address => cutOuterColons(address).split(':')
	.reduce((acc, part, _, allParts) => part.length > 0
		? acc.concat(part)
		: acc.concat(Array(9 - allParts.length).fill('0')),
	[])
	.join(':');

const longestZeroGroup = address => (address
	.match(/((^|:)0{1,4})+:?/g) || [])
	.reduce((longest, current) => current.length > longest.length
		? current
		: longest,
	'');

const collapseV6 = address => address
	.split(':')
	.map(group => parseInt(group, 16).toString(16))
	.join(':')
	.replace(new RegExp(`${longestZeroGroup(address)}`),
		match => match.length > 0 ? '::' : match);

const anonymizeIp = remoteAddress => {
	if (v4().test(remoteAddress)) {
		const mask = [255, 255, 0, 0];
		return remoteAddress.split('.')
			.map(v4Mapper(mask))
			.join('.');
	}
	if (v6().test(remoteAddress)) {
		const mask = ['ffff', 'ffff', 'ffff', 'ffff', '0', '0', '0', '0'];
		return collapseV6(expandV6(remoteAddress)
			.split(':')
			.map(v6Mapper(mask))
			.join(':'));
	}
	return '::';
};

export default anonymizeIp;

export {
	collapseV6,
	expandV6,
};
