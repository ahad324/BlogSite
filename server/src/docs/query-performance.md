# Query Performance Guide

## Indexing Strategy

- **User Model** :
- `username`: Unique index for fast lookup and uniqueness enforcement.
- `email`: Unique index for fast lookup and uniqueness enforcement.
- **Post Model** :
- `author`: Index for efficient population and filtering by author.
- `createdAt`: Index for sorting posts by creation date.
- `tags`: Index for filtering posts by tags.
- **Comment Model** :
- `post`: Index for retrieving comments by post ID.
- `createdAt`: Index for sorting comments by creation date.

## Optimization Techniques

- **Pagination** : Uses `mongoose-paginate-v2` to limit results (default 10 per page).
- **Population** : Efficiently fetches referenced User and Comment data in queries.
- **Query Caching** : Leverages MongoDB’s built-in query caching for frequently accessed data.
- **Selective Fields** : Only necessary fields are returned in queries to reduce data transfer.
- **Compound Indexes** : Considered for frequent query patterns (e.g., post filtering by tag and date).

## Performance Considerations

- Indexes reduce query execution time for large datasets.
- Population is used judiciously to avoid excessive joins.
- Pagination prevents overloading the server with large result sets.
- Validation occurs at the schema level to minimize runtime errors.
