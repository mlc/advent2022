import { Coord, range, readSplit } from './util.ts';
import { Image } from 'https://deno.land/x/imagescript@1.2.15/mod.ts';

type Dir = 'R' | 'L' | 'U' | 'D';

const vectors: Record<Dir, Coord> = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, 1],
  D: [0, -1],
};

const parse = (x: string): [Coord, number] => {
  const [dir, count] = x.split(' ');
  return [vectors[dir as Dir], Number(count)];
};

const input = (await readSplit(9, '\n', false)).map(parse);

const makeFrame = (rope: Coord[], visits: Set<string>): Image => {
  const f = new Image(350, 350);
  f.fill(0x000000ff);
  for (const cell of visits) {
    const [x, y] = cell.split(',').map(Number) as Coord;
    f.setPixelAt(x + 155, y + 35, 0x800000ff);
  }
  for (const [x, y] of rope) {
    f.setPixelAt(x + 155, y + 35, 0xaaaaaaff);
  }
  return f;
};

const fmt = (n: number): string => {
  let result = n.toString(10);
  while (result.length < 5) {
    result = `0${result}`;
  }
  return result;
};

const simul = async (n = 2) => {
  let count = 0;
  const visits = new Set<string>();
  const rope = [...range(0, n)].map<Coord>(() => [0, 0]);
  visits.add(rope[n - 1].join(','));
  for (const [[dx, dy], steps] of input) {
    for (const _i of range(0, steps)) {
      rope[0][0] += dx;
      rope[0][1] += dy;
      for (const j of range(1, n)) {
        const h = rope[j - 1];
        const t = rope[j];
        if (h[0] - t[0] >= 2) {
          t[0] += 1;
          t[1] += Math.sign(h[1] - t[1]);
        } else if (h[1] - t[1] >= 2) {
          t[1] += 1;
          t[0] += Math.sign(h[0] - t[0]);
        } else if (h[0] - t[0] <= -2) {
          t[0] -= 1;
          t[1] += Math.sign(h[1] - t[1]);
        } else if (h[1] - t[1] <= -2) {
          t[1] -= 1;
          t[0] += Math.sign(h[0] - t[0]);
        }
      }
      visits.add(rope[n - 1].join(','));

      if (count % 100 === 0) {
        console.log(count);
      }
      const img = makeFrame(rope, visits);
      await img
        .encode(2)
        .then((bytes) => Deno.writeFile(`frame${fmt(count)}.png`, bytes));
      ++count;
    }
  }
};

await simul(10);
