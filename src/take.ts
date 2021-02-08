import { ArgType, CB, Mode, Proc, send, State } from './common';

interface TakeState extends State {
  max: number;
}

interface TakeProcState extends TakeState {
  source: CB;
}

interface TakeSinkState extends TakeProcState {
  talkback: CB;
  sink: CB;
  vars: {
    sourceTalkback?: CB;
    taken: number;
    end: boolean;
  };
}

const takeSinkTBProc: Proc = (state) => (type, d) => {
  const {vars, max} = state as TakeSinkState;
  if (type === Mode.DESTROY) {
    vars.end = true;
    send(vars.sourceTalkback, type, d);
  } else if (vars.taken < max) {
    send(vars.sourceTalkback, type, d);
  }
};

const takeSourceTBProc: Proc = (state) => (type, arg) => {
  const {vars, talkback, sink, max} = state as TakeSinkState;
  if (type === Mode.INIT) {
    vars.sourceTalkback = arg as CB;
    return send(sink, 0, talkback);
  } else if (type === Mode.RUN) {
    if (vars.taken < max) {
      vars.taken++;
      send(sink, type, arg);
      if (vars.taken === max && !vars.end) {
        vars.end = true;
        send(vars.sourceTalkback, Mode.DESTROY);
        send(sink, Mode.DESTROY);
      }
    }
  } else if (type === Mode.DESTROY) {
    send(sink, Mode.DESTROY);
  }
};

const takeSinkProc: Proc = (state) => (type, sink) => {
  if (type !== Mode.INIT) return;
  const tsState = {...state} as TakeSinkState;
  tsState.sink = sink as CB;
  tsState.talkback = { state: tsState, proc: takeSinkTBProc };
  tsState.vars = {
    taken: 0,
    end: false,
    sourceTalkback: undefined,
  };
  const tb = { state: tsState, proc: takeSourceTBProc };
  return send(tsState.source as CB, Mode.INIT, tb);
};

const takeProc: Proc = (state: State) => (_type: Mode, source?: ArgType) => {
  const tpState: TakeProcState = {
    ...(state as TakeState),
    source: source as CB,
  };
  const tb = { state: tpState, proc: takeSinkProc };
  return send(source as CB, Mode.INIT, tb);
};

export const take = (max: number) => {
  const tkState: TakeState = {
    max,
  };
  return {
    state: tkState,
    proc: takeProc,
  };
};

// const take = max => source => (start, sink) => {
//     if (start !== 0) return;
//     let taken = 0;
//     let sourceTalkback;
//     let end;
//     function talkback(t, d) {
//       if (t === 2) {
//         end = true;
//         sourceTalkback(t, d);
//       } else if (taken < max) sourceTalkback(t, d);
//     }
//     source(0, (t, d) => {
//       if (t === 0) {
//         sourceTalkback = d;
//         sink(0, talkback);
//       } else if (t === 1) {
//         if (taken < max) {
//           taken++;
//           sink(t, d);
//           if (taken === max && !end) {
//             end = true
//             sourceTalkback(2);
//             sink(2);
//           }
//         }
//       } else {
//         sink(t, d);
//       }
//     });
//   };
