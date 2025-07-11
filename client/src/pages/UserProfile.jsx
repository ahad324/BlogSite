import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUser } from '../utils/api';
import PostCard from '../components/posts/PostCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser(id);
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user');
      }
    };
    fetchUser();
  }, [id]);

  if (!user && !error) return <LoadingSpinner />;
  if (error)
    return (
      <p className="text-red-500 text-center" role="alert">
        {error}
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">
          {user.username}'s Profile
        </h1>
        <p className="text-gray-300 mb-6">Email: {user.email}</p>
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">Posts</h2>
        {user.posts.length === 0 ? (
          <p className="text-gray-400">No posts yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {user.posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
