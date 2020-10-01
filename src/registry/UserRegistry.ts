import { User } from 'discord.js';


type RegistryUser = {
    user: User,
    id: string,
    username: string,
    tag: string,
    level: number,
    owner: boolean
}


export default class UserRegistry {
    private users: RegistryUser[] = [];

    add(user: RegistryUser): boolean {
        if(this.users.indexOf(user) == -1) {
            this.users.push(user);
            return true;
        }

        return false;
    }

    register(user: RegistryUser): boolean {
        return this.add(user);
    }

    remove(id: string) {
        this.users.forEach(user => {
            if(user.id == id) this.users.splice(this.users.indexOf(user), -1);
        })
    }

    get(id: string): Promise<RegistryUser> {
        return new Promise( (accept: any) => {
            this.users.forEach(user => {
                if(user.id == id) accept(user);
            });
        })
    }
}