import { readSplit, show, sumBy } from './util.ts';

interface File {
  name: string;
  size: number;
}

interface Dir {
  name: string;
  children: DirEnt[];
}

type DirEnt = File | Dir;

const input = await readSplit(7, '\n', false);

const cd = /^\$ cd (.+)$/;
const file = /^(\d+) ([a-z.]+)$/;

const parse = (pos = 0): [Dir, number] => {
  let i = pos;
  const m = cd.exec(input[i]);
  if (!m) {
    throw new Error();
  }
  const name = m[1]!;
  //console.log({ pos, name });

  if (input[++i] !== '$ ls') {
    throw new Error(`${i}`);
  }

  const children: DirEnt[] = [];

  while (i + 1 < input.length && input[++i].charAt(0) !== '$') {
    if (input[i].startsWith('dir')) {
      continue;
    }
    const mf = file.exec(input[i]);
    if (!mf) {
      throw new Error(`${i}`);
    }
    children.push({ name: mf[2], size: Number(mf[1]) });
  }

  if (i + 1 < input.length) {
    while (i < input.length && input[i] !== '$ cd ..') {
      const [child, newI] = parse(i);
      children.push(child);
      i = newI + 1;
    }
  }
  //console.log({ name, l: children.length, i });
  return [{ name, children }, i];
};

const [tree] = parse();

const sizes: number[] = [];

const walk = (d: DirEnt): number => {
  if ('size' in d) {
    return d.size;
  } else {
    const s = sumBy(d.children, walk);
    sizes.push(s);
    return s;
  }
};

const totUsed = walk(tree);

await show(sumBy(sizes.filter((size) => size <= 100000)));

const toFree = totUsed - 40000000;

sizes.sort((a, b) => a - b);

await show(sizes.find((s) => s >= toFree)!);
