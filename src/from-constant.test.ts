import { forEach } from "./for-each";
import { fromConstant } from "./from-constant";

test('', ()=>{
    const source = fromConstant(1000);
    const printOp = (value: string) => console.log(value);

    forEach(printOp)(source);
    expect(true).toBe(true);
})