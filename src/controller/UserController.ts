import { Request, Response } from "express"
import { UserDatabase } from "../database/UserDatabase"
import { User } from "../models/User"
import { CreateUserDTO, UserDB } from "../types"

export class UserController {
    constructor(){}

    public getUsers =  async (req: Request, res: Response) => {
        try {
            const name = req.query.name as string | undefined
    
            const usersDB: UserDB[] = await new UserDatabase().findUser(name)
    
            //Estabelecimento do MAP sempre para termos certeza de como os dados precisam ser retornados, os motivos para fazermos isso são vários, mas em geral é porque nunca teremos certeza de como estão nossos dados no DB, uma vez que alguém possa ter acesso e manipular manualmente um dado. Sem essa trativa, infelizmente você vai se deparar com muitas quebras do fluxo no endpoint.
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
    
            res.status(200).send(users)
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }}

    public signup = async (req: Request, res: Response) => {
        try {
            const { id, name, email, password, role } = req.body as CreateUserDTO
            const userDBInstance = new UserDatabase()
      
            if (id !== undefined) {
              if (typeof id !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
              }
            }
      
            if (name !== undefined) {
              if (typeof name !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
              }
            }
      
            if (email !== undefined) {
              if (typeof email !== "string") {
                res.status(400)
                throw new Error("'email' deve ser string")
              }
            }
      
            if (password !== undefined) {
              if (typeof password !== "string") {
                res.status(400)
                throw new Error("'password' deve ser string")
              }
            }
    
            if (role !== undefined) {
                if (typeof role !== "string") {
                  res.status(400)
                  throw new Error("'role' deve ser string")
                }
              }
      
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
      
            res.status(201).send(newUserDB)
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }}
    
    public login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body as CreateUserDTO
            const userDBInstance = new UserDatabase()
      
            if (typeof email !== "string") {
                res.status(400)
                throw new Error("'email' deve ser string")
            }
      
            if (typeof password !== "string") {
                res.status(400)
                throw new Error("'password' deve ser string")
            }
      
            const checkUser = await userDBInstance.checkUser(email, password)
    
            if(checkUser?.length === 0){
                res.status(400)
                throw new Error("usuario não cadastrado")
            } 
    
            res.status(200).send({
                message: "Login feito com sucesso!",
                checkUser
            })
            
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }
}