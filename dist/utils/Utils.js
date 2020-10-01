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
const glob_1 = __importDefault(require("glob"));
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
    static async handle(client, msg, user) {
        const prefix = client.getCommanderOptions().prefix;
        if (msg.content.startsWith(prefix)) {
            const registry = client.getModules();
            const userRegistry = client.getUsers();
            const registryUser = await userRegistry.get(user.id);
            const args = msg.content.split(" ");
            const commandName = args[0];
            args.shift();
            const command = await registry.getFromPotentialAlias(commandName.toLowerCase().replace(new RegExp("^" + prefix), ''));
            if (command) {
                const commandOptions = command.getOptions();
                if (this.canExecute(commandOptions.level, registryUser.level, commandOptions.owner, registryUser.owner))
                    command.run(msg, [args]);
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