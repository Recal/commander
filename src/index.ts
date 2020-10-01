import EventModule from './module/EventModule';
import Module from './module/Module';
import { CommanderClient as Client } from './client';

module.exports = {
    Client: Client,
    Event: EventModule,
    Module: Module
};