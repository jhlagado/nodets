export interface CB {
    init(sink: CB): void;
    run(data?: any): void;
    destroy(err?: string): void;
}

export type Operation = (value: string) => void;
export type Mapper = (value: any) => any;

export type SinkFunc = (source: CB) => CB;
