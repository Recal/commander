const HIGHEST = Number.MAX_VALUE;

export type Permissions = { [key: string]: { level: number } };

export const DefaultPermissions: Permissions = {
    ["Owner"]: { level: HIGHEST },
    ["Admin"]: { level: 2 },
    ["Moderator"]: { level: 1 },
    ["Guest"]: { level: 0 },
    ["Blacklisted"]: { level: -1 }
}

export const MapToLevel = (value: number, perms: Permissions) => {

    let v: string | null = null;

    Object.keys(perms).forEach( key => {
        if(perms[key].level == value) v = key;
    })

    return v == null ? "Unknown" : v;
}

export class PermissionsHandler {

    private perms: Permissions | null = null;

    constructor(perms: Permissions) {
        this.perms = perms;
    }

    map = (value: number) => MapToLevel(value, this.perms || DefaultPermissions);
}
