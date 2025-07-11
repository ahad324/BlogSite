import { useEffect, useState, useRef } from 'react';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/posts/PostCard.jsx';
import PostForm from '../components/posts/PostForm.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Pagination from '../components/common/Pagination.jsx';
import { debounce } from '../utils/debounce'; // ⬅️ imported from external file

function Home() {
  const { posts, loading, error, pagination, fetchPosts, addPost } = usePosts();
  const [filters, setFilters] = useState({
    tag: '',
    sort: 'createdAt',
    order: 'desc',
  });
  const [debouncedTag, setDebouncedTag] = useState('');
  const lastFetchParams = useRef(null);

  // Use useRef to keep a stable debounced function
  const debouncedFetchPosts = useRef(
    debounce((tag) => {
      setDebouncedTag(tag);
    }, 500)
  ).current;

  useEffect(() => {
    const params = {
      tag: debouncedTag,
      sort: filters.sort,
      order: filters.order,
      page: 1,
      limit: 10,
    };

    if (
      lastFetchParams.current &&
      JSON.stringify(params) === JSON.stringify(lastFetchParams.current)
    ) {
      return;
    }

    fetchPosts(params);
    lastFetchParams.current = params;
  }, [debouncedTag, filters.sort, filters.order, fetchPosts]);

  const handleTagFilter = (e) => {
    setFilters((prev) => ({ ...prev, tag: e.target.value }));
    debouncedFetchPosts(e.target.value);
  };

  const handleSortChange = (e) => {
    const [sort, order] = e.target.value.split(':');
    setFilters((prev) => ({ ...prev, sort, order }));
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-100 mb-12 text-center">
        BlogSite
      </h1>
      <PostForm onSubmit={addPost} />
      <div className="my-8 max-w-lg mx-auto flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Filter by tag..."
          value={filters.tag}
          onChange={handleTagFilter}
          name="tagFilter"
          className="flex-1 p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          aria-label="Filter posts by tag"
        />
        <div className="flex flex-col">
          <label htmlFor="sort" className="text-gray-300 mb-2 font-medium">
            Sort by: {filters.sort === 'createdAt' ? 'Date' : 'Title'}
          </label>
          <select
            id="sort"
            value={`${filters.sort}:${filters.order}`}
            onChange={handleSortChange}
            className="w-full sm:w-48 p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            aria-label="Sort posts"
          >
            <option value="createdAt:desc">Newest First (by Date)</option>
            <option value="createdAt:asc">Oldest First (by Date)</option>
            <option value="title:asc">Title A-Z</option>
            <option value="title:desc">Title Z-A</option>
          </select>
        </div>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-500 text-center" role="alert">
          {error}
        </p>
      ) : posts.length === 0 ? (
        <p className="text-gray-400 text-center">No posts found.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) =>
              fetchPosts({
                page,
                tag: debouncedTag,
                sort: filters.sort,
                order: filters.order,
                limit: 10,
              })
            }
          />
        </>
      )}
    </div>
  );
}

export default Home;
