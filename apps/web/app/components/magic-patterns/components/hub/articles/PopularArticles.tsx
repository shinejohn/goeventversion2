import React from 'react';
import { useNavigate } from 'react-router';
import { TrendingUpIcon, EyeIcon, ClockIcon } from 'lucide-react';
type PopularArticlesProps = {
  articles: any[];
  hubSlug: string;
};
export const PopularArticles = ({
  articles,
  hubSlug
}: PopularArticlesProps) => {
  const navigate = useNavigate();
  // Format the date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  // Navigate to article detail
  const handleViewArticle = (articleId: string) => {
    navigate(`/hub/${hubSlug}/articles/${articleId}`);
  };
  if (!articles.length) return null;
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <TrendingUpIcon className="h-5 w-5 text-indigo-600 mr-2" />
        <h3 className="text-lg font-bold text-gray-900">Popular Articles</h3>
      </div>
      <div className="space-y-4">
        {articles.map((article, index) => <div key={article.id} className="flex items-start space-x-3 cursor-pointer group" onClick={() => handleViewArticle(article.id)}>
            {/* Rank Number */}
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700">
              {index + 1}
            </div>
            {/* Content */}
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2">
                {article.title}
              </h4>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-50 text-purple-700 mr-2">
                  {article.contentType}
                </span>
                <div className="flex items-center mr-2">
                  <EyeIcon className="h-3 w-3 mr-1" />
                  <span>
                    {article.views > 1000 ? `${(article.views / 1000).toFixed(1)}k` : article.views}
                  </span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  <span>{article.readTimeMinutes} min</span>
                </div>
              </div>
            </div>
            {/* Image */}
            <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>
          </div>)}
      </div>
      <button onClick={() => navigate(`/hub/${hubSlug}/articles/popular`)} className="mt-4 w-full py-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium text-center">
        View All Popular Articles
      </button>
    </div>;
};