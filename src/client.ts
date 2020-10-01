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

    private _commanderOptions: CommanderOptions | null = null;
    private userRegistry: UserRegistry = new UserRegistry();
    private moduleRegistry: ModuleRegistry = new ModuleRegistry();
    private eventRegistry: EventRegistry = new EventRegistry();
    private provider: Provider = new Provider();

    constructor(options: ClientOptions, commanderOptions: CommanderOptions) {
        super(options);

        this._commanderOptions = commanderOptions;

        this.on('ready', async () => {
            CommanderUtils.addCachedUsers(this, this.users.cache);

            if(this._commanderOptions?.providerConfig) {
                let options = this._commanderOptions?.providerConfig;
                
                switch(options.type) {
                    case ProviderType.DATABASE:
                        break;
                    case ProviderType.JSON:
                        if(options.path.endsWith('.json')) Provider.fromJSON(this, this.userRegistry, require(options.path));
                        break;
                    default:
                        break;
                }
            }

            CommanderUtils.registerModulesIn(this.moduleRegistry, this._commanderOptions?.modulePath as string);
            CommanderUtils.registerBuiltinModules(this.moduleRegistry);
            if(this._commanderOptions?.eventModulePath) {
                let events = await CommanderUtils.registerEventModules(this.eventRegistry, this._commanderOptions?.eventModulePath);
                events.forEach(event => {
                    let opt = event.getOptions()!;
                    this.on(opt.event, event.handle);
                })
            }
        });
        this.on('message', (msg: Message) => {
            if(msg.author.id == msg.client.user!.id  || 
               commanderOptions.blacklist && commanderOptions.blacklist.includes(msg.author.id)
            ) return;

            

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
        return this._commanderOptions as CommanderOptions;
    }
   
    registerModule(module: CommandModule) {
        this.moduleRegistry.register(module);
    }

    blacklist(id: string) {
        if(this._commanderOptions?.blacklist) {
            let list = this._commanderOptions.blacklist;
            if(!list.includes(id)) this._commanderOptions.blacklist.push(id);
        }
    }
}