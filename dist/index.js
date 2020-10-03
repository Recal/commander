"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EventModule_1 = __importDefault(require("./module/EventModule"));
const Module_1 = __importDefault(require("./module/Module"));
const client_1 = require("./client");
module.exports = {
    Client: client_1.CommanderClient,
    Event: EventModule_1.default,
    Module: Module_1.default
};
