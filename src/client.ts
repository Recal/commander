import { Client, ClientOptions as DJSOptions, User } from 'discord.js';
import { PermissionsHandler, DefaultPermissions } from './types/PermissionManager';
import { CommanderOptions } from './types/CommanderOptions';

export default class Commander extends Client {

    private PermissionsHandler: PermissionsHandler | null = null;
    private Options: CommanderOptions | null = null;
    private InternalCache: User[] = [];


    constructor(copts: CommanderOptions, opts: DJSOptions) {
        super(opts);

        this.Options = copts;
        this.PermissionsHandler = new PermissionsHandler(copts.permissions || DefaultPermissions);

        this.on('ready', () => {
            this.InternalCache = this.users.cache.map(x => x);
            // TBD
        })

        if(copts.options.eventsPath) {
            // TBD
        }
    }

    private shouldCache(user: User) {
        if(!this.InternalCache.includes(user)) this.InternalCache.push(user);
    }
}