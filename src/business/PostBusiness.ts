import { PostsDatabase } from "../database/PostsDatabase";
import { BadRequestError } from "../error/BadRequestError";
import { NotFoundError } from "../error/NotFoundError";
import { Post } from "../models/Post";
import { PostsDB } from "../types";

export class PostBusiness {
    constructor(
        private postDatabase: PostsDatabase
    ) { }

    public getPosts = async () => {

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

    public createPost = async (input : any) => {
        const { id, content, creator_id } = input

        if(id !== undefined){
            if (typeof id !== "string") {
                throw new BadRequestError("'id' deve ser string")
            }
        }

        if(content !== undefined){
            if (typeof content !== "string") {
                throw new BadRequestError("'content' deve ser string")
            }
        }

        if(creator_id !== undefined){
            if (typeof creator_id !== "string") {
                throw new BadRequestError("'creator_id' deve ser string")
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
        const {id, content} = input

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string.")
        }

        const postDB = await this.postDatabase.findPostsById(id)

        if (!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        await this.postDatabase.updatePostById(id, content)

        const output = "Post editado!"

        return output
    }

    public deletePost = async (input : any) => {
        const {id} = input
    
        const postDB = await this.postDatabase.findPostsById(id)

        if (!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        await this.postDatabase.deletePostById(id)
        const output = "Post deletado!"

        return output
        
    }
}