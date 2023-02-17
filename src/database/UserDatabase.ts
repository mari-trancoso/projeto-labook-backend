import { User } from "../models/User";
import { UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase{
    static TABLE_USERS = "users"

    public async insertUser(parameter: User) {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .insert(parameter)
    }

    public async findUser(parameter: string | undefined): Promise <UserDB[]> {
        let result
    
        if (parameter) {
          const usersDB: UserDB[] = await BaseDatabase.connection(
            UserDatabase.TABLE_USERS
          ).where("name", "LIKE", `%${parameter}%`)
    
          result = usersDB
        } else {
          const usersDB: UserDB[] = await BaseDatabase.connection(
            UserDatabase.TABLE_USERS
          )
          result = usersDB
        }
    
        return result
      }

      public checkEmail = async (email: string): Promise<UserDB | undefined>  => {
        const result: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .select()
            .where({ email })
        
        return result[0]
    }
}