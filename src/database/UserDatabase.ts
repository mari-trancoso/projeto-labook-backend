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

    async findUser(parameter: string | undefined): Promise <UserDB[]> {
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

      private async checkUser(
        email?: string,
        password?: string
      ): Promise <void> {
        //Poderia ser utilizado o orWhere, porém defini como estratégia um envio mais objetivo do motivo do erro.
        if (email) {
          const [usersDB]: UserDB[] = await BaseDatabase.connection(
            UserDatabase.TABLE_USERS
          ).where({ email: email })
          if (usersDB) {
            throw new Error("'email' já cadastrado.")
          }
        }
        if (password) {
            const [usersDB]: UserDB[] = await BaseDatabase.connection(
              UserDatabase.TABLE_USERS
            ).where({ email: email })
            if (usersDB) {
              throw new Error("'email' já cadastrado.")
            }
          }
      }
}