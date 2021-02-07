import { CB, CBFunc } from './common';

export const pipe = (source: CB, ...cbs: CBFunc[]) => {
    let res = source;
    for (const cb of cbs) {
        res = cb(res);
    }
    return res;
};
