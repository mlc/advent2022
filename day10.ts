import { range, readSplit, show, sumBy } from './util.ts';
import { chunk } from 'collections/chunk.ts';

interface Noop {
  type: 'noop';
}

interface Addx {
  type: 'addx';
  qty: number;
}

type Op = Noop | Addx;

const parse = (x: string): Op => {
  const parts = x.split(' ');
  if (parts[0] === 'noop') {
    return { type: 'noop' };
  } else if (parts[0] === 'addx') {
    return { type: 'addx', qty: Number(parts[1]) };
  } else {
    throw new Error(x);
  }
};

const input = (await readSplit(10)).map(parse);

const vals: number[] = [];
let reg = 1;
input.forEach((op) => {
  switch (op.type) {
    case 'noop':
      vals.push(reg);
      break;
    case 'addx':
      vals.push(reg, reg);
      reg += op.qty;
      break;
  }
});

const signal = (i: number) => i * vals[i - 1];

await show(sumBy([...range(20, 221, 40)], signal));

const rows = chunk(
  vals.map((sig, i) => (Math.abs(sig - (i % 40)) <= 1 ? '#' : '.')),
  40
);

const output = [...rows.map((r) => r.join('')), ''].join('\n');

await Deno.stdout.write(new TextEncoder().encode(output));
