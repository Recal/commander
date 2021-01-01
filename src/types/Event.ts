export interface EventOptions {
    name?: string,
    event: string, 
    priority: number
}

export abstract class Event {
    private Options: EventOptions | null = null;

    constructor(opts: EventOptions) {
        this.Options = opts;
    }

    abstract execute<T>(data: T): void;
}