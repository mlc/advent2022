import { Image } from 'imagescript';

export const showGrid = async (
  pixels: boolean[][],
  blocksize = 8,
  padding = 4,
  filename?: string,
): Promise<void> => {
  const height = pixels.length;
  const width = pixels[0].length;

  const img = new Image(
    width * blocksize + 2 * padding,
    height * blocksize + 2 * padding
  );

  img.fill(0xff);
  pixels.forEach((row, y) =>
    row.forEach((val, x) => {
      img.drawBox(
        x * blocksize + padding,
        y * blocksize + padding,
        blocksize,
        blocksize,
        val ? 0x11aa11ff : 0x111111ff
      );
    })
  );
  const png = await img.encode();

  if (filename) {
    await Deno.writeFile(filename, png);
  } else {
    const process = Deno.run({
      cmd: ['display'],
      stdin: 'piped',
      stderr: 'inherit',
      stdout: 'inherit',
    });
    await process.stdin.write(png);
    await process.stdin.close();
    await process.status();
  }
};
