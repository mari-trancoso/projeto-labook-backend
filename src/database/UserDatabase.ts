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

      public async checkUser(email: string, password: string){
        if (email) {
          const usersDB: UserDB[] = await BaseDatabase.connection(
            UserDatabase.TABLE_USERS
          ).where({ email: email , password: password})
          return usersDB
        }
        
      }
}