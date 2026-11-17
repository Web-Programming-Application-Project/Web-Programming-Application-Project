-- Database is automatically created from POSTGRES_DB environment variable
-- No need to create database manually since PostgreSQL container handles this
DROP TABLE IF EXISTS list_items;
DROP TABLE IF EXISTS lists;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS test;
DROP TABLE IF EXISTS users;

CREATE TABLE test (
    id SERIAL PRIMARY KEY,
    description TEXT
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL
);

CREATE UNIQUE INDEX users_username_lower_idx ON users (lower(username));

INSERT INTO test (description) VALUES ('bar'), ('baz'), ('qux');

CREATE TABLE movies (
    id BIGSERIAL PRIMARY KEY,
    tmdb_id INTEGER NOT NULL UNIQUE
);

CREATE TABLE lists (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    share_token TEXT UNIQUE,
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE list_items (
    id BIGSERIAL PRIMARY KEY,
    list_id BIGINT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    movie_id BIGINT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (list_id, movie_id)
);
