-- Active: 1675358932515@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL, 
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id)
);

CREATE TABLE likes_dislikes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES posts (id)
);

INSERT INTO users (id, name, email, password, role)
VALUES 
    ("u001", "Mariana", "mari@email.com", "Mari123@", "normal"), 
    ("u002", "Paulo", "paulo@email.com", "Paulo123@", "normal");

INSERT INTO posts (id, creator_id, content, likes, dislikes, updated_at)
VALUES 
    ("p001", "u001", "Agora vai! Primeira entrevista em 2023", 4, 0, "não"), 
    ("p002", "u001", "Não deu certo a entrevista, mas bora pra próxima!", 10, 2, "não"), 
    ("p003", "u002", "Bora surfar hoje!", 10, 0, "não");

INSERT INTO likes_dislikes (user_id, post_id, like)
VALUES 
    ("u001", "p003", 1), 
    ("u002", "p001", 1), 
    ("u002", "p002", 1);
