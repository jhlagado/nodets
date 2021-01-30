interface State {}

type Proc = (state: State) => (type: number, tb?: CB | string) => void;
type CB = { state: State; proc: Proc };
const send = (cb: CB, type: number, arg?: CB) => cb.proc(cb.state)(type, arg);

interface FromIterState extends State {
  iterator: any;
  sink: CB;
  vars: {
    completed: boolean;
    got1: boolean;
    inloop: boolean;
    done: boolean;
  };
}

function fromIterLoop({ iterator, sink, vars }: FromIterState) {
  vars.inloop = true;
  while (vars.inloop) {
    if (!vars.got1 || vars.completed) {
      vars.inloop = false;
      break;
    } else {
      vars.got1 = false;
      const result = iterator.next();
      vars.done = result.done;
      const value = result.value;
      if (vars.done) {
        send(sink, 2);
        vars.inloop = false;
      } else {
        send(sink, 1, value);
      }
    }
  }
}

const fromIterSinkProc: Proc = (state) => (type) => {
  const fiState = state as FromIterState;
  if (fiState.vars.completed) return;
  if (type === 1) {
    fiState.vars.got1 = true;
    if (!fiState.vars.inloop && !fiState.vars.done)
      fromIterLoop(state as FromIterState);
  } else if (type === 2) {
    fiState.vars.completed = true;
  }
};

const fromIterSinkTB = (state: FromIterState): CB => {
  return { state, proc: fromIterSinkProc };
};

const fromIterProc: Proc = (state) => (type, sink): void => {
  if (type !== 0) return;
  const fiState = state as FromIterState;
  fiState.sink = sink as CB;
  const tb = fromIterSinkTB(state as FromIterState);
  send(sink as CB, 0, tb);
};

const fromIter = (iterator: any): CB => {
  return {
    state: {
      iterator,
      vars: { inloop: false, got1: false, completed: false, done: false },
    },
    proc: fromIterProc,
  };
};

interface ForEachState extends State {
  operation: Operation;
  talkback?: CB;
}

type Operation = (value: string) => void;

const forEachSourceProc: Proc = (state) => (type, data?) => {
  const feState = state as ForEachState;
  if (type === 0) feState.talkback = data as CB;
  if (type === 1) feState.operation(data as string);
  if ((type === 1 || type === 0) && feState.talkback) send(feState.talkback, 1);
};

const forEachSourceTB = (state: ForEachState): CB => {
  return { state, proc: forEachSourceProc };
};

const forEach = (operation: (value: string) => void) => (source: CB) => {
  const state: ForEachState = {
    operation,
  };
  const tb = forEachSourceTB(state);
  send(source, 0, tb);
};

const iterator = [10, 20, 30, 40][Symbol.iterator]();
const source = fromIter(iterator);

forEach((x) => console.log(x))(source);
