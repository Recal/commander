"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventRegistry {
    constructor() {
        this.events = [];
    }
    add(event) {
        if (this.events.indexOf(event) == -1) {
            this.events.push(event);
            return true;
        }
        else {
            return false;
        }
    }
    register(event) {
        return this.add(event);
    }
    remove(eventName) {
        this.events.forEach(event => {
            var _a;
            if (((_a = event.getOptions()) === null || _a === void 0 ? void 0 : _a.customName) == eventName)
                this.events.splice(this.events.indexOf(event), -1);
        });
    }
    getList() {
        return this.events;
    }
}
exports.default = EventRegistry;
//# sourceMappingURL=EventRegistry.js.map