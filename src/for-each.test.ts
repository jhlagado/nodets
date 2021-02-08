import { send, Mode } from "./common";
import { forEach } from "./for-each";
import { fromIter } from "./from-iter";

test('', ()=>{
    const iterator = [10, 20, 30, 40][Symbol.iterator]();
    const printOp = (value: string) => console.log(value);
    
    send(forEach(printOp), Mode.INIT, fromIter(iterator));
    
    expect(true).toBe(true);

})