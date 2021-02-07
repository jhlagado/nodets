import { forEach } from "./for-each";
import { fromIter } from "./from-iter";

test('', ()=>{
    const iterator = [10, 20, 30, 40][Symbol.iterator]();
    const source = fromIter(iterator);
    const printOp = (value: string) => console.log(value);

    forEach(printOp)(source);
    expect(true).toBe(true);
})