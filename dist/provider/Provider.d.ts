import UserRegistry from "../registry/UserRegistry";
import { CommanderClient } from "../client";
declare type ExpectedProviderJSON = {
    id: string;
    level: number;
    owner: boolean;
};
export default class Provider {
    static fromJSON(client: CommanderClient, registry: UserRegistry, users: ExpectedProviderJSON[]): void;
    static fromDB(): void;
}
export {};
