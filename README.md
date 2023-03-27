# Northcoders House of Games API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

The database used will be PSQL, and will interact with it using [node-postgres](https://node-postgres.com/).

## Kanban

## https://trello.com/b/jdYmok2t/northcoders-be-games-portfolio-project

To keep track of the tasks involved in this project we're going to use a kanban board. You can click on the ticket to find out more information about what is required for the feature. A ticket is not considered complete unless both the happy path and errors response are handled. 

## .env setup

If you want to clone and run this project locally you will need to create the relevant .env files. To do this create a file with the name .env.<"database-data">. in the files you will want to assign a value to the global environment variable by including this "PGDATABASE=<"database-name">".


