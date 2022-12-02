import { readSplit, sumBy } from './util.ts';

type Game = ['A' | 'B' | 'C', 'X' | 'Y' | 'Z'];

const parse = (x: string) => [x[0], x[2]] as Game;

const input = (await readSplit(2, '\n')).map(parse);

const themscores = {
  A: 1,
  B: 2,
  C: 3,
};

const myscores = {
  X: 1,
  Y: 2,
  Z: 3,
};

const winscore = ([them, me]: Game) => {
  const ts = themscores[them],
    ms = myscores[me];
  if (ts === ms) {
    return 3;
  } else if ((ts - ms + 3) % 3 === 1) {
    return 0;
  } else {
    return 6;
  }
};

const score = ([them, me]: Game) => myscores[me] + winscore([them, me]);

console.log(sumBy(input, score));

const score2 = ([them, me]: Game) => {
  const ts = themscores[them];
  switch (me) {
    case 'X':
      return 1 + ((ts + 1) % 3);
    case 'Y':
      return 3 + ts;
    default:
      return 7 + (ts % 3);
  }
};

console.log(sumBy(input, score2));
