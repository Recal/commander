declare type EventOptions = {
    event: string;
    customName: string;
};
export default abstract class EventModule {
    private options;
    constructor(options: EventOptions);
    getOptions(): EventOptions | null;
    abstract handle(data: unknown): void;
}
export {};
