import { ArgType, CB, Mode, Operation, Proc, send, State } from './common';

interface ForEachState extends State {
    operation: Operation;
}

interface ForEachSourceState extends ForEachState {
    talkback?: CB;
}

const forEachSourceProc: Proc = (state) => (type, data) => {
    const feState = state as ForEachSourceState;
    if (type === Mode.INIT) feState.talkback = data as CB;
    if (type === Mode.RUN) feState.operation(data as string);
    if ((type === Mode.RUN || type === Mode.INIT) && feState.talkback) send(feState.talkback, Mode.RUN);
};

const forEachProc:Proc = (state:State) => (type: Mode, source?: ArgType) => {
    if (type !== Mode.INIT) return;
    const tb = { state, proc: forEachSourceProc };
    return send(source as CB, Mode.INIT, tb);
};

export const forEach = (operation: (value: string) => void) => {
    const state: ForEachState = {
        operation,
    };
    return {
        state,
        proc: forEachProc
    }
};
