"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Provider {
    static fromJSON(client, registry, users) {
        users.forEach(async (user) => {
            if (!(await registry.get(user.id))) {
                let cacheUser = await client.users.fetch(user.id);
                let user_is_owner = client.getCommanderOptions().owners.includes(user.id);
                let registryUser = {
                    user: cacheUser,
                    username: cacheUser.username,
                    tag: cacheUser.tag,
                    id: cacheUser.id,
                    level: user.level,
                    owner: user_is_owner
                };
                registry.add(registryUser);
            }
        });
    }
    static fromDB() { }
}
exports.default = Provider;
//# sourceMappingURL=Provider.js.map