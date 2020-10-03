"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommanderClient = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const Utils_1 = __importDefault(require("./utils/Utils"));
const UserRegistry_1 = __importDefault(require("./registry/UserRegistry"));
const ModuleRegistry_1 = __importDefault(require("./registry/ModuleRegistry"));
const Provider_1 = __importDefault(require("./provider/Provider"));
const ProviderType_1 = require("./provider/ProviderType");
const EventRegistry_1 = __importDefault(require("./registry/EventRegistry"));
class CommanderClient extends discord_js_1.default.Client {
    constructor(options, commanderOptions) {
        super(options);
        this.commanderOptions = null;
        this.userRegistry = new UserRegistry_1.default();
        this.moduleRegistry = new ModuleRegistry_1.default();
        this.eventRegistry = new EventRegistry_1.default();
        this.provider = new Provider_1.default();
        this.commanderOptions = commanderOptions;
        this.on('ready', async () => {
            var _a, _b, _c, _d, _e;
            Utils_1.default.addCachedUsers(this, this.users.cache);
            if ((_a = this.commanderOptions) === null || _a === void 0 ? void 0 : _a.providerConfig) {
                const opts = (_b = this.commanderOptions) === null || _b === void 0 ? void 0 : _b.providerConfig;
                switch (opts.type) {
                    case ProviderType_1.ProviderType.DATABASE:
                        break;
                    case ProviderType_1.ProviderType.JSON:
                        if (opts.path.endsWith('.json'))
                            Provider_1.default.fromJSON(this, this.userRegistry, require(opts.path));
                        break;
                    default:
                        break;
                }
            }
            Utils_1.default.registerModulesIn(this.moduleRegistry, (_c = this.commanderOptions) === null || _c === void 0 ? void 0 : _c.modulePath);
            //CommanderUtils.registerBuiltinModules(this.moduleRegistry);
            if ((_d = this.commanderOptions) === null || _d === void 0 ? void 0 : _d.eventModulePath) {
                const events = await Utils_1.default.registerEventModules(this.eventRegistry, (_e = this.commanderOptions) === null || _e === void 0 ? void 0 : _e.eventModulePath);
                events.forEach(event => {
                    const opt = event.getOptions();
                    this.on(opt.event, event.handle);
                });
            }
        });
        this.on('message', (msg) => {
            const isBlacklisted = commanderOptions.blacklist && commanderOptions.blacklist.includes(msg.author.id);
            if (msg.author.id == msg.client.user.id || isBlacklisted)
                return;
            Utils_1.default.handle(this, msg, msg.author);
        });
    }
    getModules() {
        return this.moduleRegistry;
    }
    getUsers() {
        return this.userRegistry;
    }
    getCommanderOptions() {
        return this.commanderOptions;
    }
    registerModule(module) {
        this.moduleRegistry.register(module);
    }
    blacklist(id) {
        var _a;
        if ((_a = this.commanderOptions) === null || _a === void 0 ? void 0 : _a.blacklist) {
            const list = this.commanderOptions.blacklist;
            if (!list.includes(id))
                this.commanderOptions.blacklist.push(id);
        }
    }
}
exports.CommanderClient = CommanderClient;
