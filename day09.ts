import { Coord, range, readSplit, show } from './util.ts';

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

const simul = (n = 2) => {
  const visits = new Set<string>();
  const rope = [...range(0, n)].map(() => [0, 0]);
  visits.add(rope[n - 1].join(','));
  input.forEach(([[dx, dy], steps]) => {
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
    }
  });
  return visits.size;
};

await show(simul(2));
await show(simul(10));
