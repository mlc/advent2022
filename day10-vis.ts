import { range, readSplit, show, sumBy } from './util.ts';
import { chunk } from 'collections/chunk.ts';
import { Image } from 'https://deno.land/x/imagescript@1.2.15/mod.ts';

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
  vals.map((sig, i) =>
    Math.abs(sig - (i % 40)) <= 1 ? 0x11aa11ff : 0x111111ff
  ),
  40
);

const img = new Image(41 * 16, (rows.length + 1) * 16);
img.fill(0xff);
rows.forEach((row, y) =>
  row.forEach((val, x) => {
    img.drawBox(x * 16 + 8, y * 16 + 8, 16, 16, val);
  })
);

const png = await img.encode();
await Deno.writeFile('day10.png', png);
