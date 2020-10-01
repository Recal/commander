import CommandModule from '../module/Module';


type NullOr<T> = T | null;

export default class Registry {
    private commands: CommandModule[] = [];

    add(module: CommandModule): boolean {
        if(this.commands.indexOf(module) == -1) {
            this.commands.push(module);
            return true;
        } else {
            return false;
        }
    }

    register(module: CommandModule): boolean {
        return this.add(module);
    }

    remove(moduleName: string): void {
        this.commands.forEach(command => {
            if(command.getOptions()?.name == moduleName) this.commands.splice(this.commands.indexOf(command), -1);
        });
    }

    get(moduleName: string): Promise<NullOr<CommandModule>> {
        return new Promise( ( accept ) => {
            this.commands.forEach(command => {
                 if(command.getOptions()?.name == moduleName) accept(command); 
            });

            accept(null);
        })
    }

    getList() {
        return this.commands;
    }


    getFromPotentialAlias(alias: string): Promise<NullOr<CommandModule>> {
        /* If command doesn't have alias, just return self else return alias. */
        
        return new Promise( ( accept ) => {
            this.commands.forEach(command => {
                let options = command.getOptions()!;

                if(options.aliases && options.aliases?.includes(alias) || options.name == alias) accept(command);
            });

            accept(null);
        })
    }
}