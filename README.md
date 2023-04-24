<div align="center">

# Back-End-Board-Games-API

</div>

## Description

This project is a RESTful API created using Node.js, Express.js, and PostgreSQL. The API provides endpoints for making GET, POST, PATCH, and DELETE requests. The database was created using PostgreSQL and seeded with test data. The project uses Jest for testing and Supertest for endpoint testing. Kanban Trello boards were used for ticket tracking. The API is hosted using ElephantSQL and Render.

## Kanban

## https://trello.com/b/jdYmok2t/northcoders-be-games-portfolio-project

## Tech Stack

- Node.js
- Express.js
- PostgreSQL

## Installation

1. Clone the repository.
2. Run `npm install`.
3. Create a `.env.<database-data>` file and add the following:

```
DATABASE_URL=<your-database-url>
```

4. Run the following commands:

```
npm run setup-dbs
npm run seed
```

5. Start the server using `npm run start`.

## Usage

To use the API, make HTTP requests to the appropriate endpoints. Here are the available endpoints:

- `GET /api/reviews`: Returns a list of all reviews.
- `POST /api/reviews/:review_id/comments`: Post a new comment to the specified review.
- `PATCH /api/reviews/:review_id`: Updates an existing reviews votes.
- `DELETE /api/comments/:comment_id`: Deletes an existing comment.

for more endpoints take a took in the ```endpoints.json``` file.

## Testing

The API uses Jest for testing and Supertest for endpoint testing. To run the tests, use the command `npm test`.






