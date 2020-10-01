import UserRegistry from "../registry/UserRegistry";
import { CommanderClient } from "../client";

type ExpectedProviderJSON = {
    id: string,
    level: number,
    owner: boolean
}

export default class Provider {
    static fromJSON(client: CommanderClient, registry: UserRegistry, users: ExpectedProviderJSON[]) {
        users.forEach(async (user) => {
            if(!(await registry.get(user.id))) {
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

    static fromDB() {}
}