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
            if (client.getCommanderOptions().owners.indexOf(user.id) != -1) {
                client.getUsers().register({
                    user: user,
                    id: user.id,
                    username: user.username,
                    tag: user.tag,
                    level: Infinity,
                    owner: true
                });
            }
            client.getUsers().register({
                user: user,
                id: user.id,
                username: user.username,
                tag: user.tag,
                level: 0,
                owner: false
            });
        });
        console.log("[CACHE/SUCCESS] Cached " + cache.size + " user(s).");
    }
    static canExecute(level, userLevel, commandRequiresOwner, isOwner) {
        if (commandRequiresOwner) {
            return isOwner;
        }
        return (level == userLevel && !commandRequiresOwner || isOwner);
    }
    static async handle(client, msg, user) {
        let prefix = client.getCommanderOptions().prefix;
        if (msg.content.startsWith(prefix)) {
            const registry = client.getModules();
            const userRegistry = client.getUsers();
            let registryUser = await userRegistry.get(user.id);
            let args = msg.content.split(" ");
            let commandName = args[0];
            args.shift();
            let command = await registry.getFromPotentialAlias(commandName.toLowerCase().replace(new RegExp("^" + prefix), ''));
            if (command) {
                let commandOptions = command.getOptions();
                if (this.canExecute(commandOptions.level, registryUser.level, commandOptions.owner, registryUser.owner))
                    command.run(msg, [args]);
            }
        }
    }
    static registerModulesIn(registry, path) {
        console.log("[REGISTRY/INFO] Procesing modules...");
        let localCount = 0;
        glob_1.default(path + '/**.+(ts|js)', async (err, matches) => {
            if (err)
                throw err;
            for (let file of matches) {
                const Command = (await Promise.resolve().then(() => __importStar(require(file)))).default;
                let registryCommand = new Command();
                let name = registryCommand.getOptions().name;
                if (await registry.get(name) == null) {
                    registry.add(registryCommand);
                    localCount += 1;
                }
                else {
                    throw "[REGISTRY/ERROR]" + " A local module with indentifer '" + name + "'" + ' exists. (File: ' + file + ')';
                }
            }
            console.log("[REGISTRY/INFO] Registered a total of " + localCount + " command module(s).");
        });
    }
    static registerBuiltinModules(registry) {
        let localCount = 0;
        glob_1.default(process.cwd() + '/src/builtins/**.+(ts|js)', async (err, matches) => {
            if (err)
                throw err;
            for (let file of matches) {
                const Command = (await Promise.resolve().then(() => __importStar(require(file)))).default;
                let registryCommand = new Command();
                if (registry.add(registryCommand))
                    localCount += 1;
            }
            console.log("[REGISTRY/INFO] Registered a total of " + localCount + " builtin module(s).");
        });
    }
    static registerEventModules(registry, path) {
        let localCount = 0;
        return new Promise((accept) => {
            var events = [];
            glob_1.default(path + '/**.+(ts|js)', async (err, matches) => {
                if (err)
                    throw err;
                for (let file of matches) {
                    const Event = (await Promise.resolve().then(() => __importStar(require(file)))).default;
                    let registryEvent = new Event();
                    events.push(registryEvent);
                    if (registry.add(registryEvent))
                        localCount += 1;
                }
                console.log("[REGISTRY/INFO] Registered a total of " + localCount + " event module(s).");
                accept(events);
            });
        });
    }
}
exports.default = CommanderUtils;
//# sourceMappingURL=Utils.js.map