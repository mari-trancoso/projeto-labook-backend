export interface UserDB {
    id: string,
    name: string,
    email: string,
    password: string,
    role: string,
    created_at: string
}

export interface CreateUserDTO {
    id: string,
    name: string,
    email:string,
    password:string,
    role: string
}

