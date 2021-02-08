import { CBForEach } from "./for-each";
import { CBFromIterator } from "./from-iterator";
import { pipe } from "./pipe";

test('make count up to 40 and print each number', () => {
    const iterator = [10, 20, 30, 40][Symbol.iterator]();
    const printOp = (value: string) => console.log(value);

    const fi = new CBFromIterator(iterator);
    const fe = new CBForEach(printOp);
    fe.init(fi);

    pipe(
        fi, fe
    );

    expect(true).toBe(true);

})