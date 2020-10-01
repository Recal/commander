import EventModule from "../module/EventModule";


export default class EventRegistry {
    private _events: EventModule[] = [];
    add(event: EventModule): boolean {
        if(this._events.indexOf(event) == -1) {
            this._events.push(event);
            return true;
        } else {
            return false;
        }
    }

    register(event: EventModule): boolean {
        return this.add(event);
    }

    remove(eventName: string) {
        this._events.forEach(event => {
            if(event.getOptions()?.customName == eventName) this._events.splice(this._events.indexOf(event), -1);
        })
    }

    getList() {
        return this._events;
    }
}