import { neighbors, readSplit, show } from './util.ts';
import Graph from 'npm:graphology';
import type { AbstractGraph as TGraph } from 'npm:graphology-types';
import { Image } from 'imagescript';

const toHt = (p: string): number => {
  switch (p) {
    case 'S':
      return 1;
    case 'E':
      return 26;
    default:
      return p.charCodeAt(0) - 96;
  }
};

const input = (await readSplit(12, '\n', false)).map((r) => r.split(''));

interface NodeAttr {
  ht: number;
  start: boolean;
  end: boolean;
}

// @ts-ignore graphology types are so busted
const grp = new Graph({ type: 'directed' }) as TGraph<NodeAttr>;

input.forEach((row, x) =>
  row.forEach((cell, y) => {
    const k = `${x},${y}`;
    const ht = toHt(cell);
    grp.mergeNode(k, { ht, start: cell === 'S', end: cell === 'E' });
    neighbors([x, y]).forEach(([nx, ny]) => {
      if (
        input[nx] &&
        typeof input[nx][ny] === 'string' &&
        toHt(input[nx][ny]) - ht <= 1
      ) {
        const nk = `${nx},${ny}`;
        //console.log(k, nk, cell, input[nx][ny])
        grp.mergeNode(nk);
        grp.addDirectedEdge(k, nk);
      }
    });
  })
);

const bfs = (
  predicate: (node: string, attrs: NodeAttr) => boolean
): string[] => {
  const toVisit: [string, string[]][] = (
    grp.filterNodes(predicate) as string[]
  ).map((node: string): [string, string[]] => [node, []]);

  const visited = new Set<string>();
  while (toVisit.length > 0) {
    const [next, path] = toVisit.shift()!;
    //console.log({ next, depth: path.length, n: grp.getNodeAttributes(next) });
    if (visited.has(next)) {
      continue;
    }
    visited.add(next);
    if (grp.getNodeAttribute(next, 'end')) {
      return path;
    }
    const nextPath = [...path, next];
    toVisit.push(
      ...grp.mapOutboundNeighbors(next, (n): [string, string[]] => [
        n,
        nextPath,
      ])
    );
  }
  throw new Error('not found');
};

const output = async (path: string[], part: number) => {
  const img = new Image(input[0].length * 8, input.length * 8);
  grp.forEachNode((node, { ht }) => {
    const [y, x] = node.split(',').map(Number);
    let color = ht * 0x04040400 + 0xff;
    if (path.includes(node)) {
      color = color + 0x70000000;
    }
    img.drawBox(x * 8, y * 8, 8, 8, color);
  });
  const png = await img.encode();
  await Deno.writeFile(`day12-part${part}.png`, png);
  await show(path.length);
};

await output(
  bfs((_, { start }) => start),
  1
);
await output(
  bfs((_, { ht }) => ht === 1),
  2
);
