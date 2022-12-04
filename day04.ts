import { readSplit, sumBy } from './util.ts';

type S = [number, number];

const parse = (x: string) =>
  x.split(',').map((p) => p.split('-').map(Number)) as [S, S];

const input = (await readSplit(4)).map(parse);

const ov = ([[a, b], [c, d]]: [S, S]) => {
  return (c >= a && d <= b) || (c <= a && d >= b);
};

console.log(sumBy(input, ov));

const ov2 = ([[a, b], [c, d]]: [S, S]) => {
  return c <= b && d >= a;
};

console.log(sumBy(input, ov2));
