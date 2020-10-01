import EventModule from "../module/EventModule";
export default class EventRegistry {
    private _events;
    add(event: EventModule): boolean;
    register(event: EventModule): boolean;
    remove(eventName: string): void;
    getList(): EventModule[];
}
