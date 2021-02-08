import { CB } from "./common";

export class CBFTalkback implements CB {
    callbacks: any;
    owner: any;

    constructor(owner: CB, callbacks: any) {
        this.callbacks = {
            init: callbacks.init.bind(owner),
            run: callbacks.run.bind(owner),
            destroy: callbacks.destroy.bind(owner),
        }
    }

    init(d: any) {
        this.callbacks.init(d)
    }

    run(d: any) {
        this.callbacks.run(d)
    }

    destroy(d: any) {
        this.callbacks.destroy(d)
    }
}

