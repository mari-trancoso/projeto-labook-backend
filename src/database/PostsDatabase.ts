import { PostsDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PostsDatabase extends BaseDatabase{
    static TABLE_POSTS = "posts"

    public async findPostsById(id: string) {
        const [ postsDB ]: PostsDB[] | undefined[] = await BaseDatabase
            .connection(PostsDatabase.TABLE_POSTS)
            .where({ id })

        return postsDB
    }

}