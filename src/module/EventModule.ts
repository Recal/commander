type EventOptions = {
    event: string,
    customName: string
}

export default abstract class EventModule {

    private options: EventOptions | null = null;

    constructor(options: EventOptions) {
        this.options = options;
    }

    getOptions(): EventOptions | null {
        return this.options;
    }


    abstract handle(data: unknown): void;
}