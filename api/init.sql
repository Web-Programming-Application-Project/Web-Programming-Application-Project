-- Database is automatically created from POSTGRES_DB environment variable
-- No need to create database manually since PostgreSQL container handles this

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
