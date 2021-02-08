import { CB, Mapper } from "./common";
import { CBFTalkback } from "./talkback";

export class CBMap implements CB {
    source: any;
    mapper: Mapper;
    sink: CB | undefined;

    constructor(source: CB, mapper: Mapper) {
        this.source = source;
        this.mapper = mapper;
    }

    init(sink: CB) {
        this.sink = sink;
        this.source?.init(new CBFTalkback(this, {
            init(d: any) {
                this.sink.init(d)
            },
            run(d: any) {
                this.sink.run(this.mapper(d))
            },
            destroy(d: any) {
                this.sink.destroy(d)
            },
        }));
    }

    run() {
    }

    destroy() {
    }
}


// const map = f => source => (start, sink) => {
//     if (start !== 0) return;
//     source(0, (t, d) => {
//       sink(t, t === 1 ? f(d) : d)
//     });
//   };