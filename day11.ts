import { getNums, productBy, range, readSplit, show } from './util.ts';

interface Monkey {
  id: number;
  items: number[];
  operation: (old: number) => number;
  test: number;
  truePeer: number;
  falsePeer: number;
}

const parse = (x: string): Monkey => {
  const lines = x.split('\n') as [
    string,
    string,
    string,
    string,
    string,
    string
  ];
  const id = getNums(lines[0])[0];
  const items = getNums(lines[1]);
  const operation = eval(`(old) => ${lines[2].substring(19)}`);
  const test = getNums(lines[3])[0];
  const truePeer = getNums(lines[4])[0];
  const falsePeer = getNums(lines[5])[0];

  return { id, items, operation, test, truePeer, falsePeer };
};

const monkeys = (await readSplit(11, '\n\n', false)).map(parse);

//console.log(monkeys);

const hits = monkeys.map(() => 0);

for (const _i of range(0, 20)) {
  monkeys.forEach((m) => {
    m.items.forEach((item) => {
      hits[m.id]++;
      let level = m.operation(item);
      level = Math.floor(level / 3);
      const peer = level % m.test === 0 ? m.truePeer : m.falsePeer;
      monkeys[peer].items.push(level);
    });
    m.items = [];
  });
}

hits.sort((a, b) => b - a);
await show(hits[0] * hits[1]);

const monkeys2 = (await readSplit(11, '\n\n', false)).map(parse);
const hits2 = monkeys.map(() => 0);
const base = productBy(monkeys2, ({ test }) => test);

for (const _i of range(0, 10000)) {
  monkeys2.forEach((m) => {
    m.items.forEach((item) => {
      hits2[m.id]++;
      const level = m.operation(item) % base;
      const peer = level % m.test === 0 ? m.truePeer : m.falsePeer;
      monkeys2[peer].items.push(level);
    });
    m.items = [];
  });
}

hits2.sort((a, b) => b - a);
await show(hits2[0] * hits2[1]);
