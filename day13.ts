import { Pair, productBy, readSplit, show, sumBy } from './util.ts';

type Packet = number | Packet[];

const parse = (x: string) =>
  x.split('\n').map<Packet>((row) => JSON.parse(row)) as Pair<Packet>;

const input = (await readSplit(13, '\n\n', false)).map(parse);

const compare = (left: Readonly<Packet>, right: Readonly<Packet>): number => {
  if (typeof left === 'number') {
    if (typeof right === 'number') {
      return left - right;
    } else {
      return compare([left], right);
    }
  } else {
    if (typeof right === 'number') {
      return compare(left, [right]);
    } else {
      for (let i = 0; i < Math.min(left.length, right.length); ++i) {
        const trial = compare(left[i], right[i]);
        if (trial) {
          return trial;
        }
      }
      return left.length - right.length;
    }
  }
};

await show(sumBy(input, ([l, r], idx) => (compare(l, r) > 0 ? 0 : idx + 1)));

const terminals: Packet[] = [[[2]], [[6]]];

const copy = [...input.flat(), ...terminals].sort(compare);

await show(productBy(terminals, (t) => copy.indexOf(t) + 1));
