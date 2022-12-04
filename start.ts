import '@js-joda/timezone';
import { ZonedDateTime, ZoneId } from '@js-joda/core';
import { renderFile } from 'https://deno.land/x/dejs@0.10.3/mod.ts';
import { exec } from 'https://deno.land/x/execute@v1.1.0/mod.ts';
import { readableStreamFromReader, writableStreamFromWriter } from 'streams';

const now = ZonedDateTime.now(ZoneId.of('America/New_York'));
const date = now
  .toLocalDate()
  .plusDays(now.hour() >= 12 ? 1 : 0)
  .dayOfMonth();

const filename = `day${date < 10 ? '0' : ''}${date}.ts`;

const file = await Deno.open(filename, { createNew: true, write: true });
const ejs = await renderFile('template.ts.ejs', { date });
await readableStreamFromReader(ejs).pipeTo(writableStreamFromWriter(file));

console.log(`wrote ${filename}`);

await exec(['git', 'add', filename]);
