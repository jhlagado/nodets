import { Operation, CB } from "./common";

export class CBForEach implements CB {
    operation: Operation;
    source: CB | undefined;

    constructor(operation: Operation) {
        this.operation = operation;
    }

    init(source: CB) {
        this.source = source;
        this.source.init(this);
        this.source.run();
    }

    run(data: any) {
        this.operation(data)
        this.source?.run();
    }

    destroy() {
    }

}

// const forEach = operation => source => {
//     let talkback;
//     source(0, (t, d) => {
//       if (t === 0) talkback = d;
//       if (t === 1) operation(d);
//       if (t === 1 || t === 0) talkback(1);
//     });
//   };
