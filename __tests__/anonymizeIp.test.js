import expect from 'expect';
import anonymizeIp from '../src/anonymizeIp';

describe('AnonymizeIP', () => {
	it('is a function', () => {
		expect(typeof anonymizeIp).toEqual('function');
	});

	it('returns an anonymized v4 IP', () => {
		const ip = '8.8.8.8';
		expect(anonymizeIp(ip)).toEqual('8.8.0.0');
	});

	it('returns an anonymized full v6 IP', () => {
		const ip = 'fe80:1:23:456:7890:a:bc:1';
		expect(anonymizeIp(ip)).toEqual('fe80:1:23:456::');
	});

	it('returns an anonymized short v6 IP', () => {
		const ip = 'fe80::1';
		expect(anonymizeIp(ip)).toEqual('fe80::');
	});

	it('returns one double colon max', () => {
		const ip = 'fe80:0000:1234::abcd';
		expect(anonymizeIp(ip)).toEqual('fe80:0:1234::');
	});

	it('returns two colons if not v4 nor v6', () => {
		const ip = 'hello';
		expect(anonymizeIp(ip)).toEqual('::');
	});
});
