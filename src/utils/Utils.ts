import { Collection, User, Message, GuildMember } from 'discord.js';
import { CommanderClient } from '../client';
import glob from 'glob';
import ModuleRegistry from '../registry/ModuleRegistry';
import CommandModule from '../module/Module';
import EventRegistry from '../registry/EventRegistry';
import EventModule from '../module/EventModule';

export default class CommanderUtils {
    static addCachedUsers(client: CommanderClient, cache: Collection<string, User>) {
        cache.each( (user: User, _: string, __: Collection<string, User>) => {


            const user_is_owner = client.getCommanderOptions().owners.includes(user.id);
            const registryUser = {
                    user: user,
                    id: user.id,
                    username: user.username,
                    tag: user.tag,
                    level: user_is_owner ? Infinity : 0,
                    owner: user_is_owner                        
            }

            
            client.getUsers().register(registryUser);
        });
        console.log("[CACHE/SUCCESS] Cached " + cache.size + " user(s).");
    }
    

    static canExecute(level: number, userLevel: number, commandRequiresOwner: boolean, isOwner: boolean) {
        if(commandRequiresOwner) {
            return isOwner;
        }
        return (level == userLevel && !commandRequiresOwner || isOwner);
    }

    static async handle(client: CommanderClient, msg: Message, user: GuildMember | User) {
        const prefix = client.getCommanderOptions()!.prefix;
        if(msg.content.startsWith(prefix)) {
            const registry = client.getModules();
            const userRegistry = client.getUsers();

            const registryUser = await userRegistry.get(user.id);

            const args: string[] = msg.content.split(" ");
            const commandName = args[0];
            args.shift();

            const command = await registry.getFromPotentialAlias(commandName.toLowerCase().replace(new RegExp("^"+prefix), ''));

            if(command) {
                const commandOptions = command.getOptions()!;
                if(
                    this.canExecute(
                        commandOptions.level as number, 
                        registryUser.level, 
                        commandOptions.owner, 
                        registryUser.owner
                    )) command.run(msg, [args]);
            }
        }
    }

    static registerModulesIn(registry: ModuleRegistry, path: string) {
        console.log("[REGISTRY/INFO] Procesing modules...");
        let localCount = 0;
        glob(path + '/**.+(ts|js)', async (err, matches) => {
            if(err) throw err;

            for(const file of matches) {
                const Command = (await import(file)).default;

                const registryCommand = new Command();
                const name = registryCommand.getOptions().name;

                if(!(await registry.get(name))) {
                    registry.add(registryCommand as CommandModule);
                    localCount += 1;
                } else {
                   throw "[REGISTRY/ERROR]" + " A local module with indentifer '" + name + "'" + ' exists. (File: ' + file + ')';                  
                }
            }

            console.log("[REGISTRY/INFO] Registered a total of " + localCount + " command module(s).");
        });
    }

    /*
    static registerBuiltinModules(registry: ModuleRegistry) {
        let localCount = 0;
        glob(process.cwd() + '/src/builtins/**.+(ts|js)', async (err, matches) => {
            if(err) throw err;

            for(let file of matches) {
                const Command = (await import(file)).default;

                let registryCommand = new Command();
                if(registry.add(registryCommand as CommandModule)) localCount += 1;
            }

            console.log("[REGISTRY/INFO] Registered a total of " + localCount + " builtin module(s).");
        })
    }
    */

    static registerEventModules(registry: EventRegistry, path: string): Promise<EventModule[]> {
        let localCount = 0;
       

        return new Promise( (accept: any) => {
                var events: EventModule[] = [];
                glob(path + '/**.+(ts|js)', async (err, matches) => {
                    if(err) throw err;

                    for(let file of matches) {
                        const Event = (await import(file)).default;

                        let registryEvent = new Event();
                        events.push(registryEvent);

                        if(registry.add(registryEvent as EventModule)) localCount += 1;
                    }

                    console.log("[REGISTRY/INFO] Registered a total of " + localCount + " event module(s).");
                    accept(events);
                })
        });
    }
}