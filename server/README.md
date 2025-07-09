# BlogSite Backend

A professional MERN stack backend for a blog system with users, posts, and comments, implementing Task 3 requirements.

## Features

- MongoDB schema design with one-to-many and many-to-many relationships
- Pagination, filtering, and sorting for posts and comments
- Optimized queries with indexing
- Input validation using Joi
- Error handling and logging
- ES modules and modern JavaScript practices

## Setup

1. Clone the repository: `git clone <repo-url>`
2. Navigate to the server directory: `cd BlogSite/server`
3. Install dependencies: `npm install`
4. Create a `.env` file with `MONGO_URI` and `PORT`
5. Run in development mode: `npm run dev`

## Scripts

- `npm start`: Run the server in production
- `npm run dev`: Run the server with nodemon
- `npm run lint`: Run ESLint
- `npm run format`: Run Prettier
- `npm run lint:check`: Check ESLint with no warnings
- `npm run format:check`: Check Prettier formatting

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── post.controller.js
│   │   └── comment.controller.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── post.model.js
│   │   └── comment.model.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── post.routes.js
│   │   ├── comment.routes.js
│   │   └── index.js
│   ├── middlewares/
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   ├── utils/
│   │   └── helpers.js
│   └── index.js
├── .env
├── .gitignore
├── package.json
├── .prettierrc
├── eslint.config.js
└── README.md
```

## API Endpoints

- **POST /api/users** : Create a new user
- **GET /api/users/:id** : Get user details with posts
- **POST /api/posts** : Create a new post
- **GET /api/posts** : Get paginated posts with filtering and sorting
- **GET /api/posts/:id** : Get a single post with comments
- **PUT /api/posts/:id** : Update a post
- **DELETE /api/posts/:id** : Delete a post and its comments
- **POST /api/comments** : Create a new comment
- **GET /api/comments/post/:postId** : Get paginated comments for a post
