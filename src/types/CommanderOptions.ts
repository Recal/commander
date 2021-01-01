import { Permissions } from './PermissionManager';

export interface CommanderOptions {
    owners: string | string[],
    prefix: string,
    blacklist: string 
    options: {
        registerDefaults?: boolean,
        modulePath: string,
        eventsPath?: string
    }
    permissions?: Permissions
}