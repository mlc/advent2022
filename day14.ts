import { Coord, getNums, range, readSplit, show } from './util.ts';
import { slidingWindows } from 'collections/sliding_windows.ts';

const parse = (x: string): Coord[] =>
  x.split(' -> ').map((p) => getNums(p) as Coord);

const input = (await readSplit(14, '\n', false)).map(parse);

const maxY = input.flat().reduce<number>((a, [_, y]) => (a > y ? a : y), 0);

const makeGrid = () => {
  const grid = new Set<string>();
  input.forEach((row) => {
    slidingWindows(row, 2).forEach(([[x1, y1], [x2, y2]]) => {
      if (x1 === x2) {
        for (const y of range(Math.min(y1, y2), Math.max(y1, y2) + 1)) {
          grid.add(`${x1},${y}`);
        }
      } else {
        for (const x of range(Math.min(x1, x2), Math.max(x1, x2) + 1)) {
          grid.add(`${x},${y1}`);
        }
      }
    });
  });
  return grid;
};

const p1 = () => {
  const grid = makeGrid();
  const walls = grid.size;
  while (true) {
    let x = 500,
      y = 0;
    while (true) {
      if (y >= maxY) {
        return grid.size - walls;
      } else if (!grid.has(`${x},${y + 1}`)) {
        y++;
      } else if (!grid.has(`${x - 1},${y + 1}`)) {
        x--;
        y++;
      } else if (!grid.has(`${x + 1},${y + 1}`)) {
        x++;
        y++;
      } else {
        grid.add(`${x},${y}`);
        break;
      }
    }
  }
};

const p2 = () => {
  const grid = makeGrid();
  for (const x of range(0, 1000)) {
    grid.add(`${x},${maxY + 2}`);
  }
  const walls = grid.size;
  while (true) {
    let x = 500,
      y = 0;
    while (true) {
      if (!grid.has(`${x},${y + 1}`)) {
        y++;
      } else if (!grid.has(`${x - 1},${y + 1}`)) {
        x--;
        y++;
      } else if (!grid.has(`${x + 1},${y + 1}`)) {
        x++;
        y++;
      } else {
        const p = `${x},${y}`;
        if (grid.has(p)) {
          if (p !== '500,0') {
            throw new Error('Bug');
          }
          return grid.size - walls;
        } else {
          grid.add(`${x},${y}`);
          break;
        }
      }
    }
  }
};

await show(p1());
await show(p2());
