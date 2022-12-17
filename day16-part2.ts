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
  constructor(
    ons: string[] = [],
    value = 0,
    time = 26,
    currentA = 'AA',
    currentB = 'AA'
  ) {
    this.ons = ons;
    this.value = value;
    this.time = time;
    this.currentA = currentA;
    this.currentB = currentB;
  }

  turnOn(b: boolean) {
    const flowRate = b ? this.flowRateB : this.flowRateA;
    return new State(
      [...this.ons, b ? this.currentB : this.currentA].sort(),
      this.value + flowRate * this.time,
      this.time,
      this.currentA,
      this.currentB
    );
  }

  navTo(peer: string, b: boolean) {
    return new State(
      this.ons,
      this.value,
      this.time,
      b ? this.currentA : peer,
      b ? peer : this.currentB
    );
  }

  advance() {
    return new State(
      this.ons,
      this.value,
      this.time - 1,
      this.currentA,
      this.currentB
    );
  }

  get flowRateA(): number {
    return grp.getNodeAttribute(this.currentA, 'flowRate');
  }
  get flowRateB(): number {
    return grp.getNodeAttribute(this.currentB, 'flowRate');
  }

  children(): State[] {
    if (this.time === 0) {
      return [];
    }
    const resultA: State[] = grp.mapOutboundNeighbors(this.currentA, (node) =>
      this.advance().navTo(node, false)
    );
    if (!this.ons.includes(this.currentA) && this.flowRateA > 0) {
      resultA.push(this.advance().turnOn(false));
    }
    //console.log(resultA);

    const final = resultA.flatMap((state) => {
      const result: State[] = grp.mapOutboundNeighbors(state.currentB, (node) =>
        state.navTo(node, true)
      );
      if (!state.ons.includes(state.currentB) && this.flowRateB > 0) {
        result.push(state.turnOn(true));
      }
      return result;
    });
    //console.log(final);
    return final;
  }

  toString(): string {
    return [this.value, [this.currentA, this.currentB].sort()].join(',');
  }

  public readonly ons: string[];
  public readonly value: number;
  public readonly time: number;
  public readonly currentA: string;
  public readonly currentB: string;
}

const bfs = (): number => {
  const queue = new Heap<State>((a, b) => {
    return b.time - a.time || b.value - a.value;
  });
  const seen = new Set<string>();

  queue.push(new State());
  let max = 0;

  while (true) {
    const state = queue.pop()!;
    const str = state.toString();
    if (seen.has(str)) {
      //console.log(`skipping`, state);
      continue;
    }
    //console.log(state);
    if (state.time === 0) {
      return Math.max(max, state.value);
    }
    if (state.value > max) {
      //console.log(max, state);
      max = state.value;
    }
    seen.add(str);
    state.children().forEach((child) => queue.push(child));
  }
};

await show(bfs());
