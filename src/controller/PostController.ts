import { Request, Response } from "express"
import { PostsDatabase } from "../database/PostsDatabase"
import { Post } from "../models/Post"
import { PostsDB } from "../types"

export class PostController {
    constructor(){}

    public getPosts = async (req: Request, res: Response) => {
        try {
    
            const postsDatabase = new PostsDatabase()
            const postsDB = await postsDatabase.getAllPosts()
            const usersDB = await postsDatabase.getPostsAndCreator()
    
            const posts = postsDB.map((postDB) => {
                return {
                    id: postDB.id,
                    content: postDB.content,
                    likes: postDB.likes,
                    dislikes: postDB.dislikes,
                    createdAt: postDB.created_at,
                    updatedAt: postDB.updated_at,
                    creator: getCreator(postDB.creator_id)
                }
            })
    
            function getCreator(creatorId: string) {
    
                const creator = usersDB.usersDB.find((userDB) => {
                    return userDB.id === creatorId
                })
    
                return {
                    id: creator.id,
                    name: creator.name
                }
            }
    
            res.status(200).send(posts)
    
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
            const {id, content, creator_id } = req.body
    
            if(id !== undefined){
                if (typeof id !== "string") {
                    res.status(400)
                    throw new Error("'id' deve ser string")
                }
            }
    
            if(content !== undefined){
                if (typeof content !== "string") {
                    res.status(400)
                    throw new Error("'content' deve ser string")
                }
            }
    
            if(creator_id !== undefined){
                if (typeof creator_id !== "string") {
                    res.status(400)
                    throw new Error("'creator_id' deve ser string")
                }
            }
    
            const postInstance = new Post(
                id,
                creator_id,
                content,
                0,
                0,
                new Date().toISOString(),
                new Date().toISOString()
            )
    
            //pode fazer como um dto
            const newPostDB: PostsDB = {
              id: postInstance.getId(),
              creator_id: postInstance.getCreatorId(),
              content: postInstance.getContent(),
              likes: postInstance.getLikes(),
              dislikes: postInstance.getDislikes(),
              created_at: postInstance.getCreatedAt(),
              updated_at: postInstance.getUpdatedAt()
            }
    
            const postDBInstance = new PostsDatabase()
            await postDBInstance.insertPost(postInstance)
      
            res.status(201).send(newPostDB)
    
    
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
            const id = req.params.id
            const content = req.body.content
    
            if (typeof content !== "string") {
                res.status(400)
                throw new Error("'content' deve ser string.")
            }
    
            const postsDatabase = new PostsDatabase()
            const postDB = await postsDatabase.findPostsById(id)
    
            if (!postDB) {
                res.status(404)
                throw new Error("'id' não encontrado")
            }
    
            // const newContent = account.getBalance() + value
            // account.setBalance(newBalance)
    
            await postsDatabase.updatePostById(id, content)
    
            res.status(200).send("conteudo mudado")
    
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
            const id = req.params.id
    
            const postsDatabase = new PostsDatabase()
            const postDB = await postsDatabase.findPostsById(id)
    
            if (!postDB) {
                res.status(404)
                throw new Error("'id' não encontrado")
            }
    
            // const newContent = account.getBalance() + value
            // account.setBalance(newBalance)
    
            await postsDatabase.deletePostById(id)
    
            res.status(200).send("post deletado.")
    
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