import Discord, { Message, ClientOptions } from 'discord.js';
import CommanderUtils from './utils/Utils';
import UserRegistry from './registry/UserRegistry';
import ModuleRegistry from './registry/ModuleRegistry';
import CommandModule from './module/Module';
import Provider from './provider/Provider';
import { ProviderType } from './provider/ProviderType';
import EventRegistry from './registry/EventRegistry';

type CommanderOptions = {
    prefix: string,
    modulePath: string,
    eventModulePath?: string,
    owners: string[],
    blacklist?: string[],
    providerConfig?: {
        path: string,
        type: ProviderType
    }
}


export class CommanderClient extends Discord.Client {

    private commanderOptions: CommanderOptions | null = null;
    private userRegistry: UserRegistry = new UserRegistry();
    private moduleRegistry: ModuleRegistry = new ModuleRegistry();
    private eventRegistry: EventRegistry = new EventRegistry();
    private provider: Provider = new Provider();

    constructor(options: ClientOptions, commanderOptions: CommanderOptions) {
        super(options);

        this.commanderOptions = commanderOptions;

        this.on('ready', async () => {
            CommanderUtils.addCachedUsers(this, this.users.cache);

            if(this.commanderOptions?.providerConfig) {
                const opts = this.commanderOptions?.providerConfig;
                
                switch(opts.type) {
                    case ProviderType.DATABASE:
                        break;
                    case ProviderType.JSON:
                        if(opts.path.endsWith('.json')) Provider.fromJSON(this, this.userRegistry, require(opts.path));
                        break;
                    default:
                        break;
                }
            }

            CommanderUtils.registerModulesIn(this.moduleRegistry, this.commanderOptions?.modulePath as string);
            //CommanderUtils.registerBuiltinModules(this.moduleRegistry);
            if(this.commanderOptions?.eventModulePath) {
                const events = await CommanderUtils.registerEventModules(this.eventRegistry, this.commanderOptions?.eventModulePath);
                events.forEach(event => {
                    const opt = event.getOptions()!;
                    this.on(opt.event, event.handle);
                })
            }
        });
        this.on('message', (msg: Message) => {
            const isBlacklisted = commanderOptions.blacklist && commanderOptions.blacklist.includes(msg.author.id);
            if(msg.author.id == msg.client.user!.id  || isBlacklisted) return;

            CommanderUtils.handle(this, msg, msg.author);
        });
    }

    getModules(): ModuleRegistry {
        return this.moduleRegistry;
    }

    getUsers(): UserRegistry {
        return this.userRegistry;
    }

    getCommanderOptions(): CommanderOptions  {
        return this.commanderOptions as CommanderOptions;
    }
   
    registerModule(module: CommandModule) {
        this.moduleRegistry.register(module);
    }

    blacklist(id: string) {
        if(this.commanderOptions?.blacklist) {
            const list = this.commanderOptions.blacklist;
            if(!list.includes(id)) this.commanderOptions.blacklist.push(id);
        }
    }
}
