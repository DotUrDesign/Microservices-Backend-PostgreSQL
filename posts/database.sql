-- to start postgres -> psql -U postgres

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    picture_url VARCHAR(255) DEFAULT 'abc.com',
    title VARCHAR(1000),
    tag VARCHAR(255),
    userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
    usersWhoLiked integer[] default '{}'::integer[] NOT NULL,
    comments TEXT[] DEFAULT '{}'::TEXT[] NOT NULL   
);

-- on delete cascade -> It refers the userId is the primary key, postId is the foreign key which refernces the userId. So, if a particular user is removed from the database, what "ON DELETE CASCADE" does is that it also removes the posts posted by that user.