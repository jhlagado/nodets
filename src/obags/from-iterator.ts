import { CB } from "./common";
import { CBFTalkback } from "./talkback";

export class CBFromIterator implements CB {
    iterator: Iterator<number>;
    sink: CB | undefined;

    inloop = false;
    got1 = false;
    completed = false;
    done = false;

    constructor(iterator: Iterator<number>) {
        this.iterator = iterator;
    }

    init(sink: CB) {
        if (!this.sink) {
            this.sink = sink;
            sink.init(this);
        }
    }

    run() {
        if (this.completed) return;
        this.got1 = true;
        if (!this.inloop && !(this.done)) this.loop();
    }

    destroy() {
        this.completed = true;
    }

    loop() {
        this.inloop = true;
        while (this.got1 && !this.completed) {
            this.got1 = false;
            const res = this.iterator.next();
            if (res.done) {
                this.done = true;
                this.sink?.destroy();
                break;
            }
            else {
                this.sink?.run(res.value);
            }
        }
        this.inloop = false;
    }
}

// const fromIter = iter => (start, sink) => {
//     if (start !== 0) return;
//     const iterator =
//         typeof Symbol !== 'undefined' && iter[Symbol.iterator]
//             ? iter[Symbol.iterator]()
//             : iter;
//     let inloop = false;
//     let got1 = false;
//     let completed = false;
//     let res;
//     function loop() {
//         inloop = true;
//         while (got1 && !completed) {
//             got1 = false;
//             res = iterator.next();
//             if (res.done) {
//                 sink(2);
//                 break;
//             }
//             else sink(1, res.value);
//         }
//         inloop = false;
//     }
//     sink(0, t => {
//         if (completed) return

//         if (t === 1) {
//             got1 = true;
//             if (!inloop && !(res && res.done)) loop();
//         } else if (t === 2) {
//             completed = true;
//         }
//     });
// };
