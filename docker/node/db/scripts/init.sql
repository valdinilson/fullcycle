-- Create a new database if it doesn't exist
CREATE DATABASE IF NOT EXISTS challengedb;

-- Use the new database
USE challengedb;

-- Create the people table if it doesn't exist
CREATE TABLE IF NOT EXISTS people (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(255) NOT NULL
);
