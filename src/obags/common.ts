export interface CB {
    init(sink: CB): void;
    run(data?: any): void;
    destroy(err?: string): void;
}

export type Operation = (value: string) => void;
