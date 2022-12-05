import { range, readSplit, show } from './util.ts';

const [init, movesS] = (await readSplit(5, '\n\n', false)) as [string, string];

const parseG = (x: string) => {
  if (x.indexOf('[') >= 0) {
    return [[...range(1,35,4)].map(i => x[i]!)]
  } else {
    return [];
  }
}

const parsedG = init.split('\n').flatMap(parseG)

type Move = [count: number, from: number, to: number];

const parseM = (x : string) => [...x.matchAll(/\d+/g)].map(Number) as Move;

const flip = (g: string[][]) => {
  const result: string[][] = [];
  for (const i of range(1,10)) {
    result[i] = g.map(row => row[i-1]).filter(k => k !== ' ')
  }
  return result;
}
const grid = flip(parsedG);
const moves = movesS.split('\n').map(parseM);

moves.forEach(([count, from, to]) => {
  for (const _i of range(0, count)) {
    grid[to].unshift(grid[from]!.shift()!);
  }
});

await show(grid.map(x => x[0]).join(''));

const grid2 = flip(parsedG);

moves.forEach(([count, from, to]) => {
  const pairs = grid2[from]!.splice(0, count)
  grid2[to]!.splice(0, 0, ...pairs);
});

await show(grid2.map(x => x[0])?.join(''));
