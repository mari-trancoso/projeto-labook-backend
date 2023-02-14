import { Post } from "../models/Post";
import { PostsDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostsDatabase extends BaseDatabase{
    static TABLE_POSTS = "posts"

    public async getAllPosts() {
        const postsDB : PostsDB[] = await BaseDatabase
            .connection(PostsDatabase.TABLE_POSTS)
            .select()

        return postsDB
    }

    public async findPostsById(id: string) {
        const [ postsDB ]: PostsDB[] | undefined[] = await BaseDatabase
            .connection(PostsDatabase.TABLE_POSTS)
            .where({ id })

        return postsDB
    }

    public getPostsAndCreator = async () => {
        
        let postsDB: PostsDB[]

        postsDB = await this.getAllPosts()

        const usersDB = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .select()

        return {
            postsDB,
            usersDB
        }
    }

    public async insertPost(parameter: Post ) {
        await BaseDatabase
            .connection(PostsDatabase.TABLE_POSTS)
            .insert(parameter)
    }

    public async updatePostById(id: string, newContent: string) {
        await BaseDatabase
            .connection(PostsDatabase.TABLE_POSTS)
            .update({ content: newContent, updated_at: new Date().toISOString() })
            .where({ id })
    }

}


