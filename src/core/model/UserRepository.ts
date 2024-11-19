import {Repository} from "./Repository";
import {SelectUser} from "../../db/schema";

export interface User {
    username: string,
    email: string,
    pin?: number,
    isAdmin: boolean
}

// We use a Partial type for lazy loading from DB.
// If we had more users or more servers, we'd also want freshness checks.
export class UserRepository extends Repository<User>{

    protected override getFromDB<V extends keyof User>(key: string, ...params: V[]): Pick<User, V> {
        const query: string[] = params
        return undefined;
    }

    public isAdmin(username: string): Pick<User, 'username'|'isAdmin'> {
        const localUser = this.repository.get(username)
        if (localUser && localUser.isAdmin != null) {
            return { username, isAdmin: localUser.isAdmin } as Pick<User, 'username'|'isAdmin'>
        }

        return this.getFromDB(localUser.email, 'username', 'isAdmin')
    }
}