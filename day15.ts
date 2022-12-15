import { Coord, getNums, Pair, readSplit, show, sumBy } from './util.ts';
import { chunk } from 'collections/chunk.ts';

interface Entry {
  sensor: Coord;
  beacon: Coord;
}

const parse = (x: string): Entry => {
  const [sensor, beacon] = chunk(getNums(x, false), 2) as [Coord, Coord];
  return { sensor, beacon };
};

const input = (await readSplit(15, '\n', false)).map(parse);

const md = ([x1, y1]: Coord, [x2, y2]: Coord) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

const findR = (rowNum = 2000000): [Pair<number>[], Set<number>] => {
  const beacons = new Set<number>();
  const ranges: Pair<number>[] = [];

  input.forEach(({ sensor, beacon }) => {
    if (beacon[1] === rowNum) {
      beacons.add(beacon[0]);
    }

    const dist = md(sensor, beacon);
    const away = Math.abs(sensor[1] - rowNum);
    const width = dist - away;
    if (width > 0) {
      ranges.push([sensor[0] - width, sensor[0] + width]);
    }
  });

  ranges.sort(([a0, a1], [b0, b1]) => a0 - b0 || a1 - b1);
  let i = 0;
  while (i + 1 < ranges.length) {
    if (ranges[i + 1][0] <= ranges[i][1] + 1) {
      ranges[i][1] = Math.max(ranges[i][1], ranges[i + 1][1]);
      ranges.splice(i + 1, 1);
    } else {
      i++;
    }
  }

  return [ranges, beacons];
};

const [p1r, p1b] = findR();
await show(sumBy(p1r, ([a, b]) => b - a + 1) - p1b.size);

const MAX = 4000000;
for (let i = 0; i <= MAX; ++i) {
  const [r] = findR(i);
  const inRange = r.filter(([a, b]) => b >= 0 || a <= MAX);
  if (inRange.length === 2) {
    const [[_, b0]] = inRange;
    await show(4000000 * (b0 + 1) + i);
  }
}
