import { Request, Response } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { PostsDatabase } from "../database/PostsDatabase"
import { Post } from "../models/Post"
import { PostsDB } from "../types"

export class PostController {
    constructor(
        private postBusiness : PostBusiness
    ){}

    public getPosts = async (req: Request, res: Response) => {
        try {
            const output = await this.postBusiness.getPosts()
    
            res.status(200).send(output)
    
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

    public createPost = async (req: Request, res: Response) => {
        try{
            const input = {
                id: req.body.id,
                content: req.body.content,
                creator_id: req.body.creator_id,
            }

            const output = await this.postBusiness.createPost(input)
      
            res.status(201).send(output)
    
    
        } catch (error){
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

    public editPost = async(req: Request, res:Response) => {
        try{
            const input = {
                id: req.params.id,
                content: req.body.content
            }
            
            const output = await this.postBusiness.editPost(input)
    
            res.status(200).send(output)
    
        }catch(error){
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

    public deletePost = async(req: Request, res:Response) => {
        try{
            const input = {
                id: req.params.id
            }
            
            const output = await this.postBusiness.deletePost(input)
            res.status(200).send(output)
    
        }catch(error){
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