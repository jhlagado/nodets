import { CB, Mode, Proc, send, State } from "./common";
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
    if (type === Mode.RUN) {
        fiState.vars.got1 = true;
        if (!(fiState.vars.inloop || fiState.vars.done)) {
            fiState.vars.inloop = true;
        }
        while (fiState.vars.inloop) {
            if (!fiState.vars.got1 || fiState.vars.completed) {
                fiState.vars.inloop = false;
            } else {
                fiState.vars.got1 = false;
                const result = fiState.iterator.next();
                const value = result.value;
                fiState.vars.done = result.done!;
                if (fiState.vars.done) {
                    send(fiState.sink, Mode.DESTROY);
                    fiState.vars.inloop = false;
                } else {
                    send(fiState.sink, Mode.RUN, value);
                }
            }
        }
    } else if (type === Mode.DESTROY) {
        fiState.vars.completed = true;
    }
};

const fromIterProc: Proc = (state, type, sink): void => {
    if (type !== Mode.INIT) return;
    const fiState = state as FromIterState;
    fiState.sink = sink as CB;
    fiState.vars = { inloop: false, got1: false, completed: false, done: false };
    const tb = { state, proc: fromIterSinkProc };
    send(sink as CB, Mode.INIT, tb);
};

export const fromIter = (iterator: any): CB => {
    const state = {
        iterator,
    };
    return {
        state,
        proc: fromIterProc,
    };
};
