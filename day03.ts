import { chunk } from 'chunk';
import { readSplit, setIntersect, sumBy } from './util.ts';

const parse = (x: string): [Set<string>, Set<string>] => {
  const l = x.substring(0, x.length / 2);
  const r = x.substring(x.length / 2);

  return [new Set([...l]), new Set([...r])];
};

const input = (await readSplit(3, '\n', false)).map(parse);

const prio = (l: string) => {
  if (l < 'a') {
    return l.charCodeAt(0) - 64 + 26;
  } else {
    return l.charCodeAt(0) - 96;
  }
};

const p1 = sumBy(input, ([a, b]) => {
  const inter = setIntersect(a, b);
  return prio([...inter][0]);
});

console.log(p1);

const input2 = (await readSplit(3, '\n', false)).map(
  (line) => new Set([...line])
);
const chunks = chunk(input2, 3);

const p2 = sumBy(chunks, (as) => {
  const inter = setIntersect(...as);
  return prio([...inter][0]);
});

console.log(p2);
