export interface GetPostsInputDTO {
    token: string | undefined
}

export interface CreatePostInputDTO {
    token: string | undefined,
    content: unknown
}

export interface EditPostInputDTO {
    idToEdit: string,
    token: string | undefined,
    content: unknown
}

export interface DeletePostInputDTO {
    idToDelete: string,
    token: string | undefined
}