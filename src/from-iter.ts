interface State {}

type Proc = (state: State, type: number, arg?: CB | string | number) => void;
type CB = { state: State; proc: Proc };
const send = (cb: CB, type: number, arg?: CB | string | number) => cb.proc(cb.state, type, arg);

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

const fromIterSinkProc: Proc = (state, type, _arg) => {
    const fiState = state as FromIterState;
    if (fiState.vars.completed) return;
    if (type === 1) {
        fiState.vars.got1 = true;
        if (!(fiState.vars.inloop || fiState.vars.done)) {
            fiState.vars.inloop = true;
        }
        while (fiState.vars.inloop) {
            if (!fiState.vars.got1 || fiState.vars.completed) {
                fiState.vars.inloop = false;
            } else {
                fiState.vars.got1 = false;
                const result = iterator.next();
                const value = result.value;
                fiState.vars.done = result.done!;
                if (fiState.vars.done) {
                    send(fiState.sink, 2);
                    fiState.vars.inloop = false;
                } else {
                    send(fiState.sink, 1, value);
                }
            }
        }
    } else if (type === 2) {
        fiState.vars.completed = true;
    }
};

const fromIterSinkTB = (state: FromIterState): CB => {
    return { state, proc: fromIterSinkProc };
};

const fromIterProc: Proc = (state, type, sink): void => {
    if (type !== 0) return;
    const fiState = state as FromIterState;
    fiState.sink = sink as CB;
    fiState.vars = { inloop: false, got1: false, completed: false, done: false };
    const tb = fromIterSinkTB(state as FromIterState);
    send(sink as CB, 0, tb);
};

const fromIter = (iterator: any): CB => {
    const state = {
        iterator,
    };
    return {
        state,
        proc: fromIterProc,
    };
};

interface ForEachState extends State {
    operation: Operation;
    talkback?: CB;
}

type Operation = (value: string) => void;

const forEachSourceProc: Proc = (state, type, data) => {
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
const printOp = (value: string) => console.log(value);

forEach(printOp)(source);
