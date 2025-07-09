import { useEffect, useState } from 'react';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/posts/PostCard.jsx';
import PostForm from '../components/posts/PostForm.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Pagination from '../components/common/Pagination.jsx';

function Home() {
  const { posts, loading, error, pagination, fetchPosts, addPost } = usePosts();
  const [tagFilter, setTagFilter] = useState('');

  useEffect(() => {
    fetchPosts(tagFilter ? { tag: tagFilter } : {});
  }, [tagFilter]);

  const handleTagFilter = (e) => {
    setTagFilter(e.target.value);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-text-primary mb-12 text-center">
        BlogSite
      </h1>
      <PostForm onSubmit={addPost} />
      <div className="my-8 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Filter by tag..."
          value={tagFilter}
          onChange={handleTagFilter}
          className="input-field"
        />
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-error text-center">{error}</p>
      ) : posts.length === 0 ? (
        <p className="text-text-muted text-center">No posts found.</p>
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
            onPageChange={(page) => fetchPosts({ page, tag: tagFilter })}
          />
        </>
      )}
    </div>
  );
}

export default Home;
