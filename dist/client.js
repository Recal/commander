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
        this._commanderOptions = null;
        this.userRegistry = new UserRegistry_1.default();
        this.moduleRegistry = new ModuleRegistry_1.default();
        this.eventRegistry = new EventRegistry_1.default();
        this.provider = new Provider_1.default();
        this._commanderOptions = commanderOptions;
        this.on('ready', async () => {
            var _a, _b, _c, _d, _e;
            Utils_1.default.addCachedUsers(this, this.users.cache);
            if ((_a = this._commanderOptions) === null || _a === void 0 ? void 0 : _a.providerConfig) {
                let options = (_b = this._commanderOptions) === null || _b === void 0 ? void 0 : _b.providerConfig;
                switch (options.type) {
                    case ProviderType_1.ProviderType.DATABASE:
                        break;
                    case ProviderType_1.ProviderType.JSON:
                        if (options.path.endsWith('.json'))
                            Provider_1.default.fromJSON(this, this.userRegistry, require(options.path));
                        break;
                    default:
                        break;
                }
            }
            Utils_1.default.registerModulesIn(this.moduleRegistry, (_c = this._commanderOptions) === null || _c === void 0 ? void 0 : _c.modulePath);
            Utils_1.default.registerBuiltinModules(this.moduleRegistry);
            if ((_d = this._commanderOptions) === null || _d === void 0 ? void 0 : _d.eventModulePath) {
                let events = await Utils_1.default.registerEventModules(this.eventRegistry, (_e = this._commanderOptions) === null || _e === void 0 ? void 0 : _e.eventModulePath);
                events.forEach(event => {
                    let opt = event.getOptions();
                    this.on(opt.event, event.handle);
                });
            }
        });
        this.on('message', (msg) => {
            if (msg.author.id == msg.client.user.id ||
                commanderOptions.blacklist && commanderOptions.blacklist.includes(msg.author.id))
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
        return this._commanderOptions;
    }
    registerModule(module) {
        this.moduleRegistry.register(module);
    }
    blacklist(id) {
        var _a;
        if ((_a = this._commanderOptions) === null || _a === void 0 ? void 0 : _a.blacklist) {
            let list = this._commanderOptions.blacklist;
            if (!list.includes(id))
                this._commanderOptions.blacklist.push(id);
        }
    }
}
exports.CommanderClient = CommanderClient;
//# sourceMappingURL=client.js.map