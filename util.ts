// deno-lint-ignore-file no-explicit-any

export type Pair<T, U = T> = [T, U];

export const identity = <T>(x: T): T => x;

export function sumBy(array: ArrayLike<number>): number;

export function sumBy<T>(
  array: ArrayLike<T>,
  validator: (elt: T, index: number) => number | boolean
): number;

export function sumBy<T>(
  array: ArrayLike<T>,
  validator: (elt: any, index: number) => number | boolean = identity
): number {
  return Array.prototype.reduce.call(
    array,
    (accum: unknown, element: T, index: number) =>
      (accum as number) + (validator(element, index) as number),
    0
  ) as number;
}

export function productBy(array: readonly number[]): number;

export function productBy<T>(
  array: readonly T[],
  validator: (elt: T, index: number) => number
): number;

export function productBy<T>(
  array: readonly T[],
  validator: (elt: any, index: number) => number = identity
): number {
  return array.reduce(
    (accum, element, index) => accum * validator(element, index),
    1
  );
}

export const inputFilename = (day: number, t: boolean) =>
  `input${day < 10 ? '0' : ''}${day}${t ? 't' : ''}`;

export const readSplit = (
  day: number,
  separator = '\n',
  t = false
): Promise<string[]> =>
  Deno.readTextFile(inputFilename(day, t)).then((str) =>
    str.trim().split(separator)
  );

export const setIntersect = <T>(
  set: Set<T> = new Set(),
  ...sets: Set<T>[]
): Set<T> => {
  if (!sets || sets.length === 0) {
    return set;
  }

  return new Set([...set].filter((it) => sets.every((s) => s.has(it))));
};

export const mapChars = (
  str: string,
  op: (ch: string, index: number) => string
) => {
  const arr = new Array(str.length);
  for (let i = 0; i < str.length; ++i) {
    arr[i] = op(str[i], i);
  }
  return arr.join('');
};

export const addVectors = (
  vector: readonly number[] = [],
  ...vectors: readonly number[][]
): number[] => vector.map((x, i) => vectors.reduce((a, v) => a + v[i], x));

export function* range(start: number, end: number, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

export type Coord = [number, number];

export const neighbors = (
  [x, y]: Coord,
  includeDiagonals = false,
  includeSelf = false
): Coord[] => {
  const result: Coord[] = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
  if (includeDiagonals) {
    result.push([x - 1, y - 1], [x - 1, y + 1], [x + 1, y - 1], [x + 1, y + 1]);
  }
  if (includeSelf) {
    result.push([x, y]);
  }
  return result;
};

export const show = async (data: string | number) => {
  console.log(data);
  const p = Deno.run({
    cmd: ['xclip', '-i', '-selection', 'clipboard'],
    stdin: 'piped',
    stdout: 'inherit',
    stderr: 'inherit',
  });
  await p.stdin.write(new TextEncoder().encode(data.toString()));
  await p.stdin.close();
  await p.status();
};
