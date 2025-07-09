# Database Design Document

## Overview

This document outlines the MongoDB schema design for the BlogSite application, focusing on users, posts, and comments with one-to-many and many-to-many relationships, optimized for performance.

## Schema Rationale

- **User** : Stores unique username and email with indexes for fast lookup. Virtual field for posts enables efficient population.
- **Post** : References the author (User) for one-to-many relationship and embeds comment IDs for one-to-many with comments. Tags array supports many-to-many filtering. Indexes on author, createdAt, and tags optimize queries.
- **Comment** : References both author (User) and post (Post) for one-to-many relationships. Indexes on post and createdAt improve query performance.

## Relationships

- **One-to-Many** : User to Posts (one user can have many posts)
- **One-to-Many** : Post to Comments (one post can have many comments)
- **Many-to-Many** : Posts to Tags (via tags array, searchable)

## Indexing Strategy

- **User** : Indexes on `username` and `email` for unique constraints and fast lookups.
- **Post** : Indexes on `author` (for user-post queries), `createdAt` (for sorting), and `tags` (for filtering).
- **Comment** : Indexes on `post` and `createdAt` for efficient retrieval of comments by post.

## Optimization Techniques

- **Population** : Used for referencing User and Comment data, reducing data duplication.
- **Pagination** : Implemented using mongoose-paginate-v2 to limit result sets.
- **Query Planning** : Indexes ensure efficient filtering and sorting operations.
- **Schema Validation** : Mongoose schemas enforce data integrity with required fields and constraints.

## Data Flow

1. **User Creation** : Users are created with unique username and email.
2. **Post Creation** : Posts reference an author and can include tags. Comments are linked via IDs.
3. **Comment Creation** : Comments reference both a post and an author, updating the post’s comments array.
4. **Retrieval** : GET requests use pagination, populate references, and support sorting/filtering.
