import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { UserDatabase } from "../database/UserDatabase"
import { LoginInputDTO } from "../dto/userDTO"
import { BaseError } from "../error/BaseError"
import { User } from "../models/User"
import { CreateUserDTO, UserDB } from "../types"

export class UserController {
    constructor(
        private userBusiness: UserBusiness
    ){}

    public getUsers =  async (req: Request, res: Response) => {
        try {
            const name = req.query.name as string | undefined
    
            const output = await this.userBusiness.getUsers(name)
    
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }}

    public signup = async (req: Request, res: Response) => {
        try {
            const input = {
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            }

            const output = await this.userBusiness.signup(input)
      
            res.status(201).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }}
    
    public login = async (req: Request, res: Response) => {
        try {
            const input: LoginInputDTO = {
                email: req.body.email,
                password: req.body.password
            }
    
            const output = await this.userBusiness.login(input)
      
            res.status(200).send(output)
            
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}