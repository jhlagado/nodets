import { CB, Mode, Proc, send, State } from "./common";
interface FromConstantState extends State {
    value: any;
    sink: CB;
    vars: {
        completed: boolean;
    };
}

const fromConstantSinkProc: Proc = (state)=>(type, _arg) => {
    const fcState = state as FromConstantState;
    if (fcState.vars.completed) return;
    if (type === Mode.RUN) {
        send(fcState.sink, Mode.RUN, fcState.value);
    } else if (type === Mode.DESTROY) {
        fcState.vars.completed = true;
    }
};

const fromConstantProc: Proc = (state)=>( type, sink): void => {
    if (type !== Mode.INIT) return;
    const fcState = state as FromConstantState;
    fcState.sink = sink as CB;
    fcState.vars = { completed: false };
    const tb = { state, proc: fromConstantSinkProc };
    send(sink as CB, Mode.INIT, tb);
};

export const fromConstant = (value: any): CB => {
    const state = {
        value,
    };
    return {
        state,
        proc: fromConstantProc,
    };
};
