import { readSplit, show } from './util.ts';
import Graph from 'npm:graphology';
import type { AbstractGraph as TGraph } from 'npm:graphology-types';
import { Heap } from 'mnemonist';

const re =
  /^Valve (..) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)$/;

interface Entry {
  valve: string;
  flowRate: number;
  tunnels: string[];
}

const parse = (x: string): Entry => {
  const grps = re.exec(x);
  if (!grps) {
    throw new Error(x);
  }
  return {
    valve: grps[1],
    flowRate: parseInt(grps[2], 10),
    tunnels: grps[3].split(', '),
  };
};

const input = (await readSplit(16, '\n', false)).map(parse);

interface NodeAttr {
  flowRate: number;
}

// @ts-ignore graphology types are so busted
const grp = new Graph({
  type: 'directed',
  self: false,
  multi: false,
}) as TGraph<NodeAttr>;

input.forEach(({ valve, flowRate, tunnels }) => {
  grp.mergeNode(valve, { flowRate });
  tunnels.forEach((tun) => {
    grp.mergeEdge(valve, tun);
  });
});

class State {
  constructor(ons: string[] = [], value = 0, time = 30, current = 'AA') {
    this.ons = ons;
    this.value = value;
    this.time = time;
    this.current = current;
  }

  turnOn() {
    return new State(
      [...this.ons, this.current].sort(),
      this.value + this.flowRate * (this.time - 1),
      this.time - 1,
      this.current
    );
  }

  navTo(peer: string) {
    return new State(this.ons, this.value, this.time - 1, peer);
  }

  get flowRate(): number {
    return grp.getNodeAttribute(this.current, 'flowRate');
  }

  children(): State[] {
    if (this.time === 0) {
      return [];
    }
    const result: State[] = grp.mapOutboundNeighbors(this.current, (node) =>
      this.navTo(node)
    );
    if (!this.ons.includes(this.current) && this.flowRate > 0) {
      result.push(this.turnOn());
    }
    return result;
  }

  toString(): string {
    return [this.value, this.current].join(',');
  }

  public readonly ons: string[];
  public readonly value: number;
  public readonly time: number;
  public readonly current: string;
}

const bfs = (): number => {
  const queue = new Heap<State>((a, b) => {
    return b.time - a.time || b.value - a.value;
  });
  const seen = new Set<string>();

  queue.push(new State());

  while (true) {
    const state = queue.pop()!;
    const str = state.toString();
    if (seen.has(str)) {
      continue;
    }
    //console.log(state);
    if (state.time === 0) {
      return state.value;
    }
    seen.add(str);
    state.children().forEach((child) => queue.push(child));
  }

};

await show(bfs());
