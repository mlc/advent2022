import { readSplit, sumBy } from './util.ts';

const input = (await readSplit(1, '\n\n')).map((g) =>
  g.split('\n').map(Number)
);

const wts = input.map((g) => sumBy(g));

console.log(Math.max(...wts));

wts.sort((a, b) => b - a);

console.log(wts[0] + wts[1] + wts[2]);
