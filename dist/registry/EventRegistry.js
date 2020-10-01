"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventRegistry {
    constructor() {
        this._events = [];
    }
    add(event) {
        if (this._events.indexOf(event) == -1) {
            this._events.push(event);
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
        this._events.forEach(event => {
            var _a;
            if (((_a = event.getOptions()) === null || _a === void 0 ? void 0 : _a.customName) == eventName)
                this._events.splice(this._events.indexOf(event), -1);
        });
    }
    getList() {
        return this._events;
    }
}
exports.default = EventRegistry;
//# sourceMappingURL=EventRegistry.js.map