import { UserDatabase } from "../database/UserDatabase"
import { BadRequestError } from "../error/BadRequestError"
import { NotFoundError } from "../error/NotFoundError"
import { User } from "../models/User"
import { IdGenerator } from "../services/IdGenerator"
import { UserDB, USER_ROLES } from "../types"

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator
    ){}

    public getUsers = async (input: string | undefined) => {
        const name = input

        if (typeof name !== "string" && name !== undefined) {
          throw new BadRequestError("'name' deve ser string ou undefined")
        }

        const usersDB: UserDB[] = await this.userDatabase.findUser(name)

        const users: User[] = usersDB.map(
            (element) =>
                new User(
                    element.id,
                    element.name,
                    element.email,
                    element.password,
                    element.role,
                    element.created_at
                )
        )

        return users
    }

    public signup = async (input: any) => {

      const id = this.idGenerator.generate()

      const { name, email, password } = input
      const userDBInstance = new UserDatabase()

      if (name !== undefined) {
        if (typeof name !== "string") {
          throw new BadRequestError("'name' deve ser string")
        }
      }

      if (email !== undefined) {
        if (typeof email !== "string") {
          throw new BadRequestError("'email' deve ser string")
        }
      }

      if (password !== undefined) {
        if (typeof password !== "string") {
          throw new BadRequestError("'password' deve ser string")
        }
      }

      const role = USER_ROLES.NORMAL

      //Instanciando a classe User, porém passando os valores vindo das requisições e armazenando na variável userInstance.
      const userInstance = new User(
        id,
        name,
        email,
        password,
        role,
        new Date().toISOString()
      )

      //Para demonstrar a criação do usuário, precisamos acessar os valores que estão na classe, porém para acessar os valores na classe só será possível através dos métodos.
      const newUserDB: UserDB = {
        id: userInstance.getId(),
        name: userInstance.getName(),
        email: userInstance.getEmail(),
        password: userInstance.getPassword(),
        role: userInstance.getRole(),
        created_at: userInstance.getCreatedAt(),
      }
      await userDBInstance.insertUser(userInstance)

      const output = {
        message: "Cadastro realizado com sucesso",
        user: newUserDB
      }

      return (output)
    }

    public login = async (input: any) => {
        const { email, password } = input
        const userDBInstance = new UserDatabase()

        if (typeof email !== "string") {
          throw new BadRequestError("'email' deve ser string")
        }

        if (typeof password !== "string") {
          throw new BadRequestError("'password' deve ser string")
        }

        const checkUser = await userDBInstance.checkUser(email, password)

        if (checkUser?.length === 0) {
          throw new NotFoundError("usuario não cadastrado")
        } 

        const output = {
            message: "Login realizado com sucesso",
            user: checkUser
        }

        return (output)
    }
}