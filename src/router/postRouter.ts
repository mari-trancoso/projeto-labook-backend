import express from "express"
import { PostBusiness } from "../business/PostBusiness"
import { PostController } from "../controller/PostController"
import { PostsDatabase } from "../database/PostsDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const postRouter = express.Router()

const postController = new PostController(
    new PostBusiness(
        new PostsDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
)

postRouter.get("/", postController.getPosts)
postRouter.post("/", postController.createPost)
postRouter.put("/:id", postController.editPost)
postRouter.delete("/:id", postController.deletePost)
