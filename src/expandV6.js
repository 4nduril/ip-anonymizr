import {
	complement,
	compose,
	filter,
	gt,
	ifElse,
	isEmpty,
	join,
	map,
	reduce,
	split
} from 'ramda';

const getMissingGroupsCount = reduce((count, part) => count + part.length, 0);

const hasLessThenEightGroups = compose(gt(8), getMissingGroupsCount);

const fillWithZeroGroups = ifElse(
	hasLessThenEightGroups,
	parts => [...parts[0], ...Array(8 - getMissingGroupsCount(parts)).fill('0'), ...parts[1]],
	parts => [...parts[0]]
);

const notEmpty = complement(isEmpty);

const splitPartAndFilter = compose(filter(notEmpty), split(':'));

const splitInGroupsWithGap = compose(
	map(splitPartAndFilter),
	split('::')
);

const expandV6 = compose(
	join(':'),
	fillWithZeroGroups,
	splitInGroupsWithGap
);

export default expandV6;
