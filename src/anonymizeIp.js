import {
	compose,
	ifElse,
	join,
	split,
	zipWith
} from 'ramda';

import { v4, v6 } from 'ip-regex';

import collapseV6 from './collapseV6';
import expandV6 from './expandV6';

const maskV4With = (mask = [255, 255, 0, 0]) => zipWith(
	(maskByte, addressByte) => (parseInt(addressByte, 10) & maskByte).toString(10),
	mask
);

const maskV6With = (mask = ['ffff', 'ffff', 'ffff', 'ffff', '0', '0', '0', '0']) => zipWith(
	(maskByte, addressByte) => (parseInt(addressByte, 16) & parseInt(maskByte, 16)).toString(16),
	mask
);

const anonymizeIpv4 = compose(
	join('.'),
	maskV4With(),
	split('.')
);

const anonymizeIpv6 = compose(
	collapseV6,
	join(':'),
	maskV6With(),
	split(':'),
	expandV6
);

const isV4 = x => v4().test(x);
const isV6 = x => v6().test(x);

const anonymizeIp = ifElse(
	isV4,
	anonymizeIpv4,
	ifElse(
		isV6,
		anonymizeIpv6,
		() => '::'
	)
);

export default anonymizeIp;
