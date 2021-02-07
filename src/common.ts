export interface State {}

export enum Mode {
     INIT = 0,
     RUN = 1,
     DESTROY = 2,
}

export type ArgType = CB | string | number;
export type Proc = (state: State) => (type: Mode, arg?: ArgType) => void;
export type CB = { state: State; proc: Proc };
export const send = (cb: CB, type: Mode, arg?: CB | string | number) => cb.proc(cb.state)(type, arg);

