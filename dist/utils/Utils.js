"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const glob_1 = __importDefault(require("glob"));
var HandlerErrorMessages;
(function (HandlerErrorMessages) {
    HandlerErrorMessages["IS_GUILD_ONLY"] = "This command can only be executed in a guild.";
    HandlerErrorMessages["DOES_NOT_MEET_ARG_REQ"] = "The command failed to execute due to the arguments passed not meeting the required amount specified.";
})(HandlerErrorMessages || (HandlerErrorMessages = {}));
function SendEmbed(content, msg) {
    let embed = new discord_js_1.MessageEmbed();
    embed.setTitle("Error");
    embed.setDescription(content);
    embed.setColor("#ff6a6a");
    embed.timestamp = new Date().getDate();
    msg.channel.send(embed);
}
class CommanderUtils {
    static addCachedUsers(client, cache) {
        cache.each((user, _, __) => {
            const user_is_owner = client.getCommanderOptions().owners.includes(user.id);
            const registryUser = {
                user: user,
                id: user.id,
                username: user.username,
                tag: user.tag,
                level: user_is_owner ? Infinity : 0,
                owner: user_is_owner
            };
            client.getUsers().register(registryUser);
        });
    }
    static canExecute(level, userLevel, commandRequiresOwner, isOwner) {
        if (commandRequiresOwner)
            return isOwner;
        return (level == userLevel && !commandRequiresOwner || isOwner);
    }
    static ShiftNTimes(n, array) {
        for (let i = 0; i < n; i++) {
            array.shift();
        }
    }
    static async handle(client, msg, user) {
        var _a;
        const prefix = client.getCommanderOptions().prefix;
        const fixedMentionPrefix = `<@${(_a = client.user) === null || _a === void 0 ? void 0 : _a.id}>`;
        if (msg.content.startsWith(prefix) || msg.content.startsWith(fixedMentionPrefix)) {
            const registry = client.getModules();
            const userRegistry = client.getUsers();
            const registryUser = await userRegistry.get(user.id);
            const args = msg.content.split(" ");
            const startsWithMention = msg.content.startsWith(fixedMentionPrefix);
            let commandName;
            if (startsWithMention) {
                commandName = args[1].toLowerCase();
                this.ShiftNTimes(2, args);
            }
            else {
                commandName = args[0].toLowerCase().replace(new RegExp("^" + prefix), '');
                this.ShiftNTimes(1, args);
            }
            const userLevel = registryUser.level;
            const userIsOwner = registryUser.owner;
            const command = await registry.getFromPotentialAlias(commandName);
            if (command) {
                const commandOptions = command.getOptions();
                const commandLevel = commandOptions.level;
                const commandRequiresOwner = commandOptions.owner;
                const commandGuildOnly = commandOptions.is_guild_only;
                const wasSentInGuild = msg.guild != null;
                const isGlobalCommand = !commandOptions.is_guild_only;
                if (this.canExecute(commandLevel, userLevel, commandRequiresOwner, userIsOwner)) {
                    const required_arg_length = commandOptions.required_args_length ? commandOptions.required_args_length : 0;
                    const meets_arg_requirement = required_arg_length > 0 ? args.length == required_arg_length : args.length >= 0;
                    if (meets_arg_requirement) {
                        if (commandGuildOnly && wasSentInGuild) {
                            command.run(msg, [args]);
                        }
                        else {
                            SendEmbed(HandlerErrorMessages.IS_GUILD_ONLY, msg);
                        }
                        if (isGlobalCommand) {
                            command.run(msg, [args]);
                        }
                        return;
                    }
                    SendEmbed(HandlerErrorMessages.DOES_NOT_MEET_ARG_REQ, msg);
                }
            }
        }
    }
    static registerModulesIn(registry, path) {
        glob_1.default(path + '/**.+(ts|js)', async (err, matches) => {
            if (err)
                throw err;
            for (const file of matches) {
                const Command = (await Promise.resolve().then(() => __importStar(require(file)))).default;
                const registryCommand = new Command();
                if (!registryCommand.getOptions()) {
                    throw `Module must have valid options. (File: '${file}')`;
                    return;
                }
                const name = registryCommand.getOptions().name;
                if (!(await registry.get(name))) {
                    registry.add(registryCommand);
                }
                else {
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
    static registerEventModules(registry, path) {
        return new Promise((accept) => {
            var events = [];
            glob_1.default(path + '/**.+(ts|js)', async (err, matches) => {
                if (err)
                    throw err;
                for (let file of matches) {
                    const Event = (await Promise.resolve().then(() => __importStar(require(file)))).default;
                    let registryEvent = new Event();
                    events.push(registryEvent);
                    registry.add(registryEvent);
                }
                accept(events);
            });
        });
    }
}
exports.default = CommanderUtils;
//# sourceMappingURL=Utils.js.map