type EventOptions = {
    event: string,
    customName: string
}

export default abstract class EventModule {

    private _options: EventOptions | null = null;

    constructor(options: EventOptions) {
        this._options = options;
    }

    getOptions(): EventOptions | null {
        return this._options;
    }


    abstract handle(data: any): void;
}