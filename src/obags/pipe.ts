import { CB, SinkFunc } from "./common";

export const pipe = (source:CB, ...sfs:SinkFunc[]) => {
    let res = source;
    for (let i = 0, n = sfs.length; i < n; i++) res = sfs[i](res);
    return res;
}