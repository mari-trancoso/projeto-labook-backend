import express, { Request, Response } from 'express'
import cors from 'cors'
import { CreateUserDTO, PostsDB, UserDB } from './types'
import { UserDatabase } from './database/UserDatabase'
import { User } from './models/User'
import { PostsDatabase } from './database/PostsDatabase'
import { Post } from './models/Post'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
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
})


//-----------------------------------SIGN UP
app.post("/users/signup", async (req: Request, res: Response) => {
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
    }
})


//-----------------------------------GET ALL USERS
app.get("/users", async (req: Request, res: Response) => {
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
    }
})


//-----------------------------------LOGIN
app.post("/users/login", async (req: Request, res: Response) => {
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
})


//-----------------------------------GET ALL POSTS
app.get("/posts", async (req: Request, res: Response) => {
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
})


//-----------------------------------CREATE POST
app.post("/posts", async (req: Request, res: Response) => {
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
})


//-----------------------------------EDIT POST
app.put("/posts/:id", async(req: Request, res:Response) => {
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
})


//-----------------------------------DELETE POST
app.delete("/posts/:id", async(req: Request, res:Response) => {
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
})
