import { CB, Mode, send } from './common';

export const pipe = (...cbs: CB[]) => {
    const [source, ...rest] = cbs; 
    let res = source;
    for (const cb of rest) {
        res = send(cb, Mode.INIT, res) as CB;
    }
    return res;
};
