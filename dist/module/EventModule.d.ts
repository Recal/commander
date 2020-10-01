declare type EventOptions = {
    event: string;
    customName: string;
};
export default abstract class EventModule {
    private _options;
    constructor(options: EventOptions);
    getOptions(): EventOptions | null;
    abstract handle(data: any): void;
}
export {};
