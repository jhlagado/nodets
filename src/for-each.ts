import { CB, Mode, Proc, send, State } from "./common";
import { fromIter } from "./from-iter";

interface ForEachState extends State {
    operation: Operation;
}

interface ForEachSourceState extends ForEachState {
    talkback?: CB;
}

type Operation = (value: string) => void;

const forEachSourceProc: Proc = (state, type, data) => {
    const feState = state as ForEachSourceState;
    if (type === Mode.INIT) feState.talkback = data as CB;
    if (type === Mode.RUN) feState.operation(data as string);
    if ((type === Mode.RUN || type === Mode.INIT) && feState.talkback) send(feState.talkback, Mode.RUN);
};

export const forEach = (operation: (value: string) => void) => {
    return (source: CB) => {
    const state: ForEachState = {
        operation,
    };
    const tb = { state, proc: forEachSourceProc };
    send(source, Mode.INIT, tb);
}
};

const iterator = [10, 20, 30, 40][Symbol.iterator]();
const source = fromIter(iterator);
const printOp = (value: string) => console.log(value);

forEach(printOp)(source);
