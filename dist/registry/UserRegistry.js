"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserRegistry {
    constructor() {
        this.users = [];
    }
    add(user) {
        if (this.users.indexOf(user) == -1) {
            this.users.push(user);
            return true;
        }
        return false;
    }
    register(user) {
        return this.add(user);
    }
    remove(id) {
        this.users.forEach(user => {
            if (user.id == id)
                this.users.splice(this.users.indexOf(user), -1);
        });
    }
    get(id) {
        return new Promise((accept) => {
            this.users.forEach(user => {
                if (user.id == id)
                    accept(user);
            });
        });
    }
}
exports.default = UserRegistry;
//# sourceMappingURL=UserRegistry.js.map