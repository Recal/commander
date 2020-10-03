import { Collection, User, Message, GuildMember, MessageEmbed } from 'discord.js';
import { CommanderClient } from '../client';
import glob from 'glob';
import ModuleRegistry from '../registry/ModuleRegistry';
import CommandModule from '../module/Module';
import EventRegistry from '../registry/EventRegistry';
import EventModule from '../module/EventModule';

enum HandlerErrorMessages {
    IS_GUILD_ONLY = "This command can only be executed in a guild.",
    DOES_NOT_MEET_ARG_REQ = "The command failed to execute due to the arguments passed not meeting the required amount specified."
}

function SendEmbed(content: string, msg: Message): void {

    let embed = new MessageEmbed();
    embed.setTitle("Error")
    embed.setDescription(content);
    embed.setColor("#ff6a6a");
    embed.timestamp = new Date().getDate();

    msg.channel.send(embed);
}


export default class CommanderUtils {
    static addCachedUsers(client: CommanderClient, cache: Collection<string, User>) {
        cache.each( (user, _, __) => {


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
    }
    

    static canExecute(level: number, userLevel: number, commandRequiresOwner: boolean, isOwner: boolean) {
        if(commandRequiresOwner) return isOwner;

        return (level == userLevel && !commandRequiresOwner || isOwner);
    }

    static ShiftNTimes(n: number, array: unknown[]): void {
        for(let i = 0; i < n; i++) {
            array.shift();
        }
    }

    static async handle(client: CommanderClient, msg: Message, user: GuildMember | User) {
        const prefix = client.getCommanderOptions().prefix;

        const fixedMentionPrefix = `<@${client.user?.id}>`

        if(msg.content.startsWith(prefix) || msg.content.startsWith(fixedMentionPrefix)) {
            
            const registry = client.getModules();
            const userRegistry = client.getUsers();
            const registryUser = await userRegistry.get(user.id);
            const args: string[] = msg.content.split(" ");
            const startsWithMention = msg.content.startsWith(fixedMentionPrefix);

            let commandName;

            if(startsWithMention) {
                commandName = args[1].toLowerCase();
                this.ShiftNTimes(2, args);
            } else {
                commandName = args[0].toLowerCase().replace(new RegExp("^"+prefix), '');
                this.ShiftNTimes(1, args);
            }

            const userLevel = registryUser.level;
            const userIsOwner = registryUser.owner;
    
            const command = await registry.getFromPotentialAlias(commandName);

            if(command) {
                const commandOptions = command.getOptions()!;
                const commandLevel = commandOptions.level as number;
                const commandRequiresOwner = commandOptions.owner;

                const commandGuildOnly = commandOptions.is_guild_only;
                const wasSentInGuild = msg.guild != null;
                const isGlobalCommand = !commandOptions.is_guild_only;

                if(this.canExecute(commandLevel, userLevel, commandRequiresOwner, userIsOwner))  {
                        const required_arg_length = commandOptions.required_args_length ? commandOptions.required_args_length : 0;
                        const meets_arg_requirement = required_arg_length > 0 ? args.length == required_arg_length : args.length >= 0;
                        if(meets_arg_requirement) {
                            if(commandGuildOnly && wasSentInGuild) {
                                command.run(msg, [args]);
                            } else {
                                SendEmbed(HandlerErrorMessages.IS_GUILD_ONLY, msg);
                            }

                            if(isGlobalCommand) {
                                command.run(msg, [args]);
                            }
                            
                            return;
                        }

                        SendEmbed(HandlerErrorMessages.DOES_NOT_MEET_ARG_REQ, msg);
                    }
            }
        }
    }

    static registerModulesIn(registry: ModuleRegistry, path: string) {
        glob(path + '/**.+(ts|js)', async (err, matches) => {
            if(err) throw err;

            for(const file of matches) {
                const Command = (await import(file)).default;

                const registryCommand = new Command() as CommandModule;

                if(!registryCommand.getOptions()) {
                    throw `Module must have valid options. (File: '${file}')`;
                    return;
                }

                const name = registryCommand.getOptions()!.name;

                if(!(await registry.get(name))) {
                    registry.add(registryCommand);
                } else {
                   throw `A local module with name '${name}' exists. (File: '${file}')'`;                
                }
            }
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
        })
    }
    */

    static registerEventModules(registry: EventRegistry, path: string): Promise<EventModule[]> {
        return new Promise( ( accept ) => {
                var events: EventModule[] = [];
                glob(path + '/**.+(ts|js)', async (err, matches) => {
                    if(err) throw err;

                    for(let file of matches) {
                        const Event = (await import(file)).default;

                        let registryEvent = new Event() as EventModule;

                        events.push(registryEvent);

                        registry.add(registryEvent);
                    }
                    accept(events);
                })
        });
    }
}