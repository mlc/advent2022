import { chunk } from 'collections/chunk.ts';
import { range, readSplit, show, sumBy } from './util.ts';
import { showGrid } from './vis.ts';

type Op = ['noop'] | ['addx', string];

const parse = (x: string): Op => x.split(' ') as Op;

const input = (await readSplit(10)).map(parse);

const vals: number[] = [];
let reg = 1;
input.forEach((op) => {
  switch (op[0]) {
    case 'noop':
      vals.push(reg);
      break;
    case 'addx':
      vals.push(reg, reg);
      reg += parseInt(op[1], 10);
      break;
  }
});

const signal = (i: number) => i * vals[i - 1];

await show(sumBy([...range(20, 221, 40)], signal));

const rows = chunk(
  vals.map((sig, i) => Math.abs(sig - (i % 40)) <= 1),
  40
);

await showGrid(rows, 16, 8);
