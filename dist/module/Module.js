"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandModule {
    constructor(options) {
        this.moduleOptions = null;
        this._moduleOptions = this.moduleOptions;
        this.moduleOptions = options;
    }
    getOptions() {
        return this.moduleOptions;
    }
}
exports.default = CommandModule;
//# sourceMappingURL=Module.js.map