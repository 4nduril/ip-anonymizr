import {
	compose,
	identity,
	ifElse,
	join,
	map,
	match,
	reduce,
	replace,
	split
} from 'ramda';

const findLongestString = (longest, current) => (current.length > longest.length
	? current
	: longest);

const longestZeroGroup = compose(
	reduce(findLongestString, ''),
	match(/((^|:)0{1,4})+:?/g)
);

const replaceZeroGroupsIfThere = ifElse(
	longestZeroGroup,
	s => replace(new RegExp(`${longestZeroGroup(s)}`), '::', s),
	identity
);

const removeLeadingZeros = group => parseInt(group, 16).toString(16);

const collapseV6 = compose(
	replaceZeroGroupsIfThere,
	join(':'),
	map(removeLeadingZeros),
	split(':')
);

export default collapseV6;
