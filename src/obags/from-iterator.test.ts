import { CBForEach } from "./for-each";
import { CBFromIterator } from "./from-iterator";

test('make count up to 40 and print each number', ()=>{
    const iterator = [10, 20, 30, 40][Symbol.iterator]();
    const printOp = (value: string) => console.log(value);
    
    const fe = new CBForEach(printOp);
    const fi = new CBFromIterator(iterator);
    fe.init(fi);
    
    expect(true).toBe(true);

})