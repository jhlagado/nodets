import { forEach } from "./for-each";
import { fromIter } from "./from-iter";
import { pipe } from "./pipe";

test('', ()=>{
    const iterator = [10, 20, 30, 40][Symbol.iterator]();
    const printOp = (value: string) => console.log(value);
    
    pipe(fromIter(iterator),forEach(printOp))
    
    expect(true).toBe(true);

})