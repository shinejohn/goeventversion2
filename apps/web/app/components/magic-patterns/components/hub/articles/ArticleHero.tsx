import React from 'react';
import { useNavigationContext } from '../../../context/NavigationContext';
import { CalendarIcon, ClockIcon, EyeIcon, HeartIcon, MessageSquareIcon, ShareIcon, BookmarkIcon } from 'lucide-react';
type ArticleHeroProps = {
  article: any;
  hubSlug: string;
};
export const ArticleHero = ({
  article,
  hubSlug
}: ArticleHeroProps) => {
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
  return <div className="relative bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={handleViewArticle}>
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-1/2 h-64 lg:h-auto relative">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 flex space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-600 text-white">
              Featured
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {article.contentType}
            </span>
          </div>
        </div>
        {/* Content Section */}
        <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-3">
            {article.title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag: string, index: number) => <span key={index} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                {tag}
              </span>)}
          </div>
          {/* Author & Date */}
          <div className="flex items-center mb-4">
            <img src={article.author.avatar} alt={article.author.name} className="h-10 w-10 rounded-full mr-3 cursor-pointer" onClick={handleViewAuthor} />
            <div>
              <div className="text-sm font-medium text-gray-900 hover:text-indigo-600 cursor-pointer" onClick={handleViewAuthor}>
                {article.author.name}
              </div>
              <div className="text-xs text-gray-500">{article.author.role}</div>
            </div>
          </div>
          {/* Metadata & Stats */}
          <div className="flex flex-wrap items-center text-sm text-gray-500 mt-auto">
            <div className="flex items-center mr-4">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center mr-4">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{article.readTimeMinutes} min read</span>
            </div>
            <div className="flex items-center mr-4">
              <EyeIcon className="h-4 w-4 mr-1" />
              <span>{article.views.toLocaleString()} views</span>
            </div>
            <div className="flex items-center">
              <MessageSquareIcon className="h-4 w-4 mr-1" />
              <span>{article.comments} comments</span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <div className="flex space-x-3">
              <button className="flex items-center text-gray-500 hover:text-red-500">
                <HeartIcon className="h-5 w-5 mr-1" />
                <span className="text-sm">{article.likes}</span>
              </button>
              <button className="flex items-center text-gray-500 hover:text-blue-500">
                <ShareIcon className="h-5 w-5 mr-1" />
                <span className="text-sm">{article.shares}</span>
              </button>
            </div>
            <button className="flex items-center text-gray-500 hover:text-indigo-600">
              <BookmarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>;
};