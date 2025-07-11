import { Link } from 'react-router-dom';
import { formatDate, truncateText } from '../../utils/helpers';

function PostCard({ post }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-3">
        <img
          src={post.author.profilePicture || 'https://via.placeholder.com/40'}
          alt={`${post.author.username}'s profile`}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <span className="text-gray-400">{post.author.username}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-100 mb-3">
        <Link
          to={`/posts/${post._id}`}
          className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
        >
          {post.title}
        </Link>
      </h3>
      <p className="text-gray-300 leading-relaxed mb-4">
        {truncateText(post.content, 120)}
      </p>
      <div className="flex justify-between text-sm text-gray-400 mb-4">
        <span>{formatDate(post.createdAt)}</span>
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-emerald-500 text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-emerald-600 transition-colors duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostCard;
