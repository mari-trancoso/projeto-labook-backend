import { UserDatabase } from "../database/UserDatabase"
import { LoginInputDTO, LoginOutputDTO } from "../dto/userDTO"
import { BadRequestError } from "../error/BadRequestError"
import { NotFoundError } from "../error/NotFoundError"
import { User } from "../models/User"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager, TokenPayload } from "../services/TokenManager"
import { UserDB, USER_ROLES } from "../types"

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
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

      const id = this.idGenerator.generate()
      const hashedPassword = await this.hashManager.hash(password)
      const role = USER_ROLES.NORMAL
      const createdAt = new Date().toISOString()

      //Instanciando a classe User, porém passando os valores vindo das requisições e armazenando na variável userInstance.
      const userInstance = new User(
        id,
        name,
        email,
        hashedPassword,
        role,
        createdAt
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

      const payload: TokenPayload = {
        id: userInstance.getId(),
        name: userInstance.getName(),
        role: userInstance.getRole()
      }

      const token = this.tokenManager.createToken(payload)

      const output = {
        message: "Cadastro realizado com sucesso",
        token
      }

      return (output)
    }

    public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
      const { email, password } = input

      if (typeof email !== "string") {
          throw new BadRequestError("'email' deve ser string")
      }

      if (typeof password !== "string") {
          throw new BadRequestError("'password' deve ser string")
      }

      const userDB: UserDB | undefined = await this.userDatabase.checkEmail(email)

      if (!userDB) {
          throw new NotFoundError("'email' não cadastrado")
      }

      const user = new User(
          userDB.id,
          userDB.name,
          userDB.email,
          userDB.password,
          userDB.role,
          userDB.created_at
      )

      const hashedPassword = user.getPassword()

      const isPasswordCorrect = await this.hashManager
          .compare(password, hashedPassword)
      
      if (!isPasswordCorrect) {
          throw new BadRequestError("'password' incorreto")
      }
      
      const payload: TokenPayload = {
          id: user.getId(),
          name: user.getName(),
          role: user.getRole()
      }

      const token = this.tokenManager.createToken(payload)

      const output: LoginOutputDTO = {
          token
      }

      return output
    }
}