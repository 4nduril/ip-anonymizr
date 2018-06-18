const { BABEL_ENV, NODE_ENV } = process.env;

const cjs = BABEL_ENV === 'cjs' || NODE_ENV === 'cjs';

module.exports = {
	presets: [
		[ 'env', { modules: false } ],
	],
	plugins: [
		cjs && 'transform-es2015-modules-commonjs',
	].filter(Boolean),
}
