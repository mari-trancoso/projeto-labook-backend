import { PostsDatabase } from "../database/PostsDatabase";
import { CreatePostInputDTO, GetPostsInputDTO } from "../dto/postDTO";
import { BadRequestError } from "../error/BadRequestError";
import { NotFoundError } from "../error/NotFoundError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { PostsDB } from "../types";

export class PostBusiness {
    constructor(
        private postDatabase: PostsDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public getPosts = async (input: GetPostsInputDTO) => {
        const {token} = input

        if (token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        const postsDB = await this.postDatabase.getAllPosts()
        const usersDB = await this.postDatabase.getPostsAndCreator()

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

        return posts
    }

    public createPost = async (input : CreatePostInputDTO) => {

        const { token, content } = input
        
        if (token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()
        const creatorId = payload.id

        const postInstance = new Post(
            id,
            creatorId,
            content,
            0,
            0,
            createdAt,
            updatedAt
        )

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

        return newPostDB
    }

    public editPost = async (input:any) => {
        const { idToEdit, token, content } = input

        if (token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string.")
        }

        const postDB = await this.postDatabase.findPostsById(idToEdit)

        if (!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (postDB.creator_id !== creatorId) {
            throw new BadRequestError("somente quem criou a playlist pode editá-la")
        }

        await this.postDatabase.updatePostById(idToEdit, content)

        const output = "Post editado!"

        return output
    }

    public deletePost = async (input : any) => {
        const { idToDelete, token } = input

        if (token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

    
        const postDB = await this.postDatabase.findPostsById(idToDelete)

        if (!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (postDB.creator_id !== creatorId) {
            throw new BadRequestError("somente quem criou a playlist pode editá-la")
        }

        await this.postDatabase.deletePostById(idToDelete)
        const output = "Post deletado!"

        return output
        
    }
}