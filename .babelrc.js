const { BABEL_ENV, NODE_ENV } = process.env;

const cjs = BABEL_ENV === 'cjs' || NODE_ENV === 'cjs';
const test = BABEL_ENV === 'test' || NODE_ENV === 'test';

module.exports = {
	presets: [
		[ 'env', { modules: false } ],
	],
	plugins: [
		(cjs || test) && 'transform-es2015-modules-commonjs',
	].filter(Boolean),
};
