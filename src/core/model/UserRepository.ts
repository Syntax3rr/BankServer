import {Repository} from "./Repository";
import {db} from "../../db";
import {usersTable} from "../../db/schema";
import {eq} from "drizzle-orm";

export interface User {
    username: string,
    email: string,
    pin?: number,
    isAdmin: boolean
}

// We use a Partial type for lazy loading from DB.
// If we had more users or more servers, we'd also want freshness checks.
export class UserRepository extends Repository<User>{

    protected async getFromDB<V extends keyof User>(username: string, ...params: V[]) {
        const thing = params.map((param) => [param, usersTable[param]])
        const query = Object.fromEntries(thing)

        return db.select(query)
            .from(usersTable)
            .where(eq(usersTable.username, username)) as Partial<User>
    }

    public async isAdmin(username: string): Promise<boolean> {
        const localUser = this.repository.get(username)
        if (localUser && localUser.isAdmin != null) {
            return localUser.isAdmin
        }

        return await this.getFromDB(username, 'isAdmin')
    }
}