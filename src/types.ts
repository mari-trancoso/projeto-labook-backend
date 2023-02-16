export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}

export interface UserDB {
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLES,
    created_at: string
}

export interface CreateUserDTO {
    id: string,
    name: string,
    email:string,
    password:string,
    role: USER_ROLES
}

export interface PostsDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}

export interface CreatePost {
    id: string,
    creator_id: string,
    content: string,
    created_at: string
}

