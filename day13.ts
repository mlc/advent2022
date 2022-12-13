import { readSplit, show, sumBy } from './util.ts';

type Packet = number | Packet[];

const parse = (x: string) =>
  x.split('\n').map((row) => JSON.parse(row)) as [Packet, Packet];

const input = (await readSplit(13, '\n\n', false)).map(parse);

const compare = (
  left: Packet | undefined,
  right: Packet | undefined
): number => {
  if (typeof left === 'number') {
    if (typeof right === 'number') {
      return left - right;
    } else if (Array.isArray(right)) {
      return compare([left], right);
    } else {
      return 1000;
    }
  } else if (Array.isArray(left)) {
    if (typeof right === 'number') {
      return compare(left, [right]);
    } else if (Array.isArray(right)) {
      for (let i = 0; i < Math.max(left.length, right.length); ++i) {
        const trial = compare(left[i], right[i]);
        if (trial) {
          return trial;
        }
      }
      return 0;
    } else {
      return 1000;
    }
  } else {
    return -compare(right, left);
  }
};

await show(sumBy(input, ([l, r], idx) => (compare(l, r) > 0 ? 0 : idx + 1)));

const copy = [...input.flat(), [[2]], [[6]]]
  .sort(compare)
  .map((elt) => JSON.stringify(elt));
const idx = copy.indexOf('[[2]]');
const idx2 = copy.indexOf('[[6]]');

await show((idx + 1) * (idx2 + 1));
