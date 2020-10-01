"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandModule {
    constructor(options) {
        this.moduleOptions = null;
        this.moduleOptions = options;
    }
    getOptions() {
        return this.moduleOptions ? this.moduleOptions : null;
    }
}
exports.default = CommandModule;
//# sourceMappingURL=Module.js.map