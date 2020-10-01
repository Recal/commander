"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Module_1 = __importDefault(require("../../module/Module"));
class A extends Module_1.default {
    constructor() {
        super({
            name: "b",
            level: 0,
            group: "t",
            aliases: ['aa'],
            owner: false
        });
    }
    run(msg) {
        msg.channel.send("hi");
    }
}
exports.default = A;
//# sourceMappingURL=b.js.map