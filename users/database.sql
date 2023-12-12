-- Getting started with postgreSQL => psql -U postgres

CREATE DATABASE microservices

-- \c microservices

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) CHECK (LENGTH(password) >= 5 AND LENGTH(password) <= 50) NOT NULL,
    profilePhoto VARCHAR(255),
    role VARCHAR(255) DEFAULT 'user'
    userHistory integer[],
    likedPosts integer[]
);

-- TO ADD A NEW COLUMN - userHistory, likedPosts
-- userHistory
ALTER TABLE users ADD COLUMN userHistory integer[] default '{}'::integer[] NOT NULL;

-- likedPosts
ALTER TABLE users ADD COLUMN likedPosts integer[] default '{}' :: integer[] NOT NULL;

-- is user logged in or not -> required for the posts section 
ALTER TABLE users ADD COLUMN is_logged_in BOOLEAN DEFAULT false;
