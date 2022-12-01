import { Month, ZonedDateTime } from 'https://esm.sh/@js-joda/core@5.4.2';
import { writableStreamFromWriter } from 'https://deno.land/std@0.166.0/streams/mod.ts';
import { inputFilename } from './util.ts';

const exists = (fn: string): Promise<boolean> =>
  Deno.stat(fn).then(
    ({ isFile }) => isFile,
    () => false
  );

const now = ZonedDateTime.now();
const day = now.dayOfMonth();
const year = now.year();

if (now.month() !== Month.DECEMBER || day >= 26) {
  throw new Error("it's not the right season");
}

const filename = inputFilename(day, false);

if (await exists(filename)) {
  console.log('already present');
  Deno.exit(0);
}

const cookie = await Deno.readTextFile(
  Deno.env.get('HOME')! + '/.aoccookie'
).then((d) => d.trim());

const resp = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
  headers: {
    Cookie: cookie,
    'User-Agent': 'mlc-advent/0.1 github.com/mlc/advent2022',
  },
});

if (!resp.ok) {
  console.error(resp.statusText);
  Deno.exit(1);
}

if (!resp.body) {
  throw new Error('no body??');
}

const file = await Deno.open(filename, { write: true, create: true });
const stream = writableStreamFromWriter(file);
await resp.body.pipeTo(stream);

console.log(`${filename} written`);
