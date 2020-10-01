import EventModule from "../module/EventModule";


export default class EventRegistry {
    private events: EventModule[] = [];
    add(event: EventModule): boolean {
        if(this.events.indexOf(event) == -1) {
            this.events.push(event);
            return true;
        } else {
            return false;
        }
    }

    register(event: EventModule): boolean {
        return this.add(event);
    }

    remove(eventName: string) {
        this.events.forEach(event => {
            if(event.getOptions()?.customName == eventName) this.events.splice(this.events.indexOf(event), -1);
        })
    }

    getList() {
        return this.events;
    }
}