"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Registry {
    constructor() {
        this._commands = [];
    }
    add(module) {
        if (this._commands.indexOf(module) == -1) {
            this._commands.push(module);
            return true;
        }
        else {
            return false;
        }
    }
    register(module) {
        return this.add(module);
    }
    remove(moduleName) {
        this._commands.forEach(command => {
            var _a;
            if (((_a = command.getOptions()) === null || _a === void 0 ? void 0 : _a.name) == moduleName)
                this._commands.splice(this._commands.indexOf(command), -1);
        });
    }
    get(moduleName) {
        return new Promise((accept) => {
            this._commands.forEach(command => {
                var _a;
                if (((_a = command.getOptions()) === null || _a === void 0 ? void 0 : _a.name) == moduleName)
                    accept(command);
            });
            accept(null);
        });
    }
    getList() {
        return this._commands;
    }
    getFromPotentialAlias(alias) {
        /* If command doesn't have alias, just return self else return alias. */
        return new Promise((accept) => {
            this._commands.forEach(command => {
                var _a;
                let options = command.getOptions();
                if (options.aliases && ((_a = options.aliases) === null || _a === void 0 ? void 0 : _a.includes(alias)) || options.name == alias)
                    accept(command);
            });
            accept(null);
        });
    }
}
exports.default = Registry;
//# sourceMappingURL=ModuleRegistry.js.map