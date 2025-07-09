# Data Flow Documentation

## Overview

This document describes how data moves through the BlogSite application for major operations, focusing on the interactions between frontend requests, backend routes, controllers, and MongoDB.

## Create Post

1. **Request** : Frontend sends POST `/api/posts` with title, content, tags, and author ID.
2. **Validation** : Middleware validates the request body using Joi schema.
3. **Controller** : `createPost` creates a new Post document and saves it to MongoDB.
4. **Response** : Returns the created post with populated author data.

## Get Posts

1. **Request** : Frontend sends GET `/api/posts?page=1&limit=10&sort=createdAt&order=desc&tag=tech`.
2. **Controller** : `getPosts` processes query parameters, applies pagination, filtering, and sorting.
3. **Database** : MongoDB query with `mongoose-paginate-v2` fetches posts with populated author data.
4. **Response** : Returns paginated posts with metadata (total pages, count).

## Create Comment

1. **Request** : Frontend sends POST `/api/comments` with content, author ID, and post ID.
2. **Validation** : Middleware validates the request body.
3. **Controller** : `createComment` creates a Comment document and updates the Post’s comments array.
4. **Response** : Returns the created comment.

## Get Comments

1. **Request** : Frontend sends GET `/api/comments/post/:postId?page=1&limit=10`.
2. **Controller** : `getComments` fetches comments for the specified post with pagination and populated author data.
3. **Response** : Returns paginated comments with metadata.

## Data Flow Diagram

- **Frontend → API** : HTTP requests to `/api` endpoints.
- **API → Controller** : Routes map to controller functions.
- **Controller → Model** : Mongoose models handle database operations.
- **Model → MongoDB** : Executes queries with indexing and population.
- **MongoDB → Response** : Returns data through controllers to the frontend.
