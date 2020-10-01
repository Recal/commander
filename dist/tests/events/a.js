"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EventModule_1 = __importDefault(require("../../module/EventModule"));
class MessageCreate extends EventModule_1.default {
    constructor() {
        super({
            event: 'message',
            customName: "MessageCreateEvent"
        });
    }
    handle(data) {
        console.log("Message created: " + data.content);
    }
}
exports.default = MessageCreate;
//# sourceMappingURL=a.js.map