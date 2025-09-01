import React from 'react';
import { useNavigationContext } from '../../../context/NavigationContext';
import { CalendarIcon, ClockIcon, EyeIcon, HeartIcon, MessageSquareIcon, BookmarkIcon } from 'lucide-react';
type ArticleCardProps = {
  article: any;
  hubSlug: string;
};
export const ArticleCard = ({
  article,
  hubSlug
}: ArticleCardProps) => {
  const {
    navigateTo
  } = useNavigationContext();
  // Format the date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  // Navigate to article detail
  const handleViewArticle = () => {
    navigateTo(`/hub/${hubSlug}/articles/${article.id}`);
  };
  // Navigate to author profile
  const handleViewAuthor = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo(`/profile/${article.author.id}`);
  };
  return <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer flex flex-col" onClick={handleViewArticle}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {article.contentType}
          </span>
        </div>
      </div>
      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {article.excerpt}
        </p>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {article.tags.slice(0, 3).map((tag: string, index: number) => <span key={index} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
              {tag}
            </span>)}
          {article.tags.length > 3 && <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
              +{article.tags.length - 3} more
            </span>}
        </div>
        {/* Author & Date */}
        <div className="flex items-center mt-auto mb-3">
          <img src={article.author.avatar} alt={article.author.name} className="h-8 w-8 rounded-full mr-2 cursor-pointer" onClick={handleViewAuthor} />
          <div>
            <div className="text-sm font-medium text-gray-900 hover:text-indigo-600 cursor-pointer" onClick={handleViewAuthor}>
              {article.author.name}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(article.publishedAt)}
            </div>
          </div>
        </div>
        {/* Metadata */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center">
              <ClockIcon className="h-3.5 w-3.5 mr-1" />
              <span>{article.readTimeMinutes} min</span>
            </div>
            <div className="flex items-center">
              <EyeIcon className="h-3.5 w-3.5 mr-1" />
              <span>
                {article.views > 1000 ? `${(article.views / 1000).toFixed(1)}k` : article.views}
              </span>
            </div>
            <div className="flex items-center">
              <HeartIcon className="h-3.5 w-3.5 mr-1" />
              <span>{article.likes}</span>
            </div>
            <div className="flex items-center">
              <MessageSquareIcon className="h-3.5 w-3.5 mr-1" />
              <span>{article.comments}</span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-indigo-600">
            <BookmarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>;
};