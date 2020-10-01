import { CommanderClient } from '../client';
import path from 'path';

let Client = new CommanderClient({}, {
    prefix: '!',
    modulePath: path.join(__dirname + '/modules'),
    eventModulePath: path.join(__dirname + '/events'),
    owners: [],
    blacklist: []
});


Client.login('');