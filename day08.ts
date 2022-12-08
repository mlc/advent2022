import { neighbors, productBy, readSplit, show, sumBy } from './util.ts';

const parse = (x: string) => [...x].map(Number);

const input = (await readSplit(8, '\n', false)).map(parse);

const visible: boolean[][] = input.map((row) => row.map(() => false));

for (let i = 0; i < input.length; ++i) {
  let ht = -1;
  for (let j = 0; j < input[0].length; ++j) {
    if (input[i][j] > ht) {
      visible[i][j] = true;
      ht = input[i][j];
    }
  }

  ht = -1;
  for (let j = input[0].length - 1; j >= 0; --j) {
    if (input[i][j] > ht) {
      visible[i][j] = true;
      ht = input[i][j];
    }
  }
}

for (let j = 0; j < input[0].length; ++j) {
  let ht = -1;
  for (let i = 0; i < input.length; ++i) {
    if (input[i][j] > ht) {
      visible[i][j] = true;
      ht = input[i][j];
    }
  }

  ht = -1;
  for (let i = input.length - 1; i >= 0; --i) {
    if (input[i][j] > ht) {
      visible[i][j] = true;
      ht = input[i][j];
    }
  }
}

await show(sumBy(visible.flat()));

const vectors = neighbors([0, 0]);

let max = 0;

for (let i = 0; i < input.length; ++i) {
  for (let j = 0; j < input[0].length; ++j) {
    const hts = vectors.map(([dx, dy]) => {
      let x = i + dx,
        y = j + dy;
      let cnt = 0;
      const ht = input[i][j];
      while (x >= 0 && y >= 0 && x < input.length && y < input[0].length) {
        ++cnt;
        if (input[x][y] >= ht) {
          break;
        }
        x += dx;
        y += dy;
      }
      return cnt;
    });
    const score = productBy(hts);
    max = Math.max(max, score);
  }
}

await show(max);
