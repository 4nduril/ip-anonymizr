import anonymizeIp from '../src/anonymizeIp';
import collapseV6 from '../src/collapseV6';
import expandV6 from '../src/expandV6';

describe('AnonymizeIP', () => {
	describe('default export', () => {
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
	describe('High-Level helper functions', () => {
		describe('collapseV6', () => {
			it('returns IPs without zero groups or leading zeros as is', () => {
				const ip = 'fe80:1:23:456:7890:a:bc:1';
				expect(collapseV6(ip)).toEqual(ip);
			});
			it('collapses zero groups at the beginning of an IP', () => {

				const ip = '0:0:1:2:3:4:5:6';
				const collapsed = '::1:2:3:4:5:6';
				expect(collapseV6(ip)).toEqual(collapsed);
			});
			it('collapses zero groups at the end of an IP', () => {

				const ip = '1:2:3:4:5:6:0:0';
				const collapsed = '1:2:3:4:5:6::';
				expect(collapseV6(ip)).toEqual(collapsed);
			});
			it('collapses zero groups in the middle of an IP', () => {

				const ip = '1:2:3:0:0:4:5:6';
				const collapsed = '1:2:3::4:5:6';
				expect(collapseV6(ip)).toEqual(collapsed);
			});
			it('collapses leading zeros', () => {

				const ip = '1:02:3:0:0:4:5:6';
				const collapsed = '1:2:3::4:5:6';
				expect(collapseV6(ip)).toEqual(collapsed);
			});
			it('collapses 0:0:0:0:0:0:0:0 to ::', () => {

				const ip = '0:0:0:0:0:0:0:0';
				const collapsed = '::';
				expect(collapseV6(ip)).toEqual(collapsed);
			});
			it('collapses only the longest group', () => {

				const ipFirst = '1:0:0:4:0:6:7:8';
				const collapsedFirst = '1::4:0:6:7:8';
				expect(collapseV6(ipFirst)).toEqual(collapsedFirst);

				const ipSecond = '1:0:3:4:0:0:7:8';
				const collapsedSecond = '1:0:3:4::7:8';
				expect(collapseV6(ipSecond)).toEqual(collapsedSecond);
			});
		});
		describe('expandV6', () => {
			it('recreates zeros for a single collapsed group', () => {
				const collapsed = '1:2:3::5:6:7:8';
				const expanded = '1:2:3:0:5:6:7:8';
				expect(expandV6(collapsed)).toEqual(expanded);
			});
			it('recreates zeros for multiple collapsed groups', () => {
				const collapsed = '1:2:3::8';
				const expanded = '1:2:3:0:0:0:0:8';
				expect(expandV6(collapsed)).toEqual(expanded);
			});
			it('recreates zeros for collapsed groups at the beginning', () => {
				const collapsed = '::4:5:6:7:8';
				const expanded = '0:0:0:4:5:6:7:8';
				expect(expandV6(collapsed)).toEqual(expanded);
			});
			it('recreates zeros for multiple collapsed groups', () => {
				const collapsed = '1:2:3:4:5:6::';
				const expanded = '1:2:3:4:5:6:0:0';
				expect(expandV6(collapsed)).toEqual(expanded);
			});
			it('recreates zeros for "::"', () => {
				const collapsed = '::';
				const expanded = '0:0:0:0:0:0:0:0';
				expect(expandV6(collapsed)).toEqual(expanded);
			});
		});
	});
});

