import { CommanderOptions } from "./types/CommanderOptions";

export function parse(message: string, opts: CommanderOptions & { registry: null /* TODO: TBD */ } ) {
    if(message.startsWith(opts.prefix)) {
        // TBD
    }
}