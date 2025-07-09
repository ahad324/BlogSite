import { Link } from 'react-router-dom';
import { formatDate, truncateText } from '../../utils/helpers';

function PostCard({ post }) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-text-primary mb-3">
        <Link
          to={`/posts/${post._id}`}
          className="text-primary hover:text-primary-dark transition-colors"
        >
          {post.title}
        </Link>
      </h3>
      <p className="text-text-secondary mb-4">
        {truncateText(post.content, 120)}
      </p>
      <div className="flex justify-between text-sm text-text-muted">
        <span>By {post.author.username}</span>
        <span>{formatDate(post.createdAt)}</span>
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostCard;
