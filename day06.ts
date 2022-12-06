import { inputFilename, show } from './util.ts';

const input = (await Deno.readTextFile(inputFilename(6, false))).trim();
//const input='bvwbjplbgvbhsrlpgdmjqwftvncz'

const allDiff = (x: string): boolean => new Set([...x]).size === x.length;

const f = (n = 4): number => {
  for (let i = n; i < input.length; ++i) {
    if (allDiff(input.substring(i - n, i))) {
      return i;
    }
  }

  throw new Error('no');
};

await show(f());
await show(f(14));
