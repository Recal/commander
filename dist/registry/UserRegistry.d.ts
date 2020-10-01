import { User } from 'discord.js';
declare type RegistryUser = {
    user: User;
    id: string;
    username: string;
    tag: string;
    level: number;
    owner: boolean;
};
export default class UserRegistry {
    private users;
    add(user: RegistryUser): boolean;
    register(user: RegistryUser): boolean;
    remove(id: string): void;
    get(id: string): Promise<RegistryUser>;
}
export {};
