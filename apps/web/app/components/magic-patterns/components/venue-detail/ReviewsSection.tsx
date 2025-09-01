import React, { useState } from 'react';
import { StarIcon, MessageCircleIcon } from 'lucide-react';
type ReviewsSectionProps = {
  id: string;
  reviews: any[];
  rating: number;
  reviewCount: number;
};
export const ReviewsSection = ({
  id,
  reviews,
  rating,
  reviewCount
}: ReviewsSectionProps) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  // Generate rating breakdown (for demo purposes)
  const ratingBreakdown = [{
    stars: 5,
    percentage: 75
  }, {
    stars: 4,
    percentage: 20
  }, {
    stars: 3,
    percentage: 3
  }, {
    stars: 2,
    percentage: 1
  }, {
    stars: 1,
    percentage: 1
  }];
  // Generate category ratings (for demo purposes)
  const categoryRatings = [{
    name: 'Accuracy',
    rating: 4.8
  }, {
    name: 'Communication',
    rating: 4.9
  }, {
    name: 'Cleanliness',
    rating: 4.7
  }, {
    name: 'Location',
    rating: 4.6
  }, {
    name: 'Value',
    rating: 4.5
  }];
  // Display all or limited reviews based on state
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  return <section id={id} className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
      {/* Summary Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-gray-900">{rating}</div>
            <div className="flex items-center mt-2">
              {Array.from({
              length: 5
            }).map((_, i) => <StarIcon key={i} className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {reviewCount} reviews
            </div>
          </div>
          {/* Rating Breakdown */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Rating Breakdown
            </h3>
            <div className="space-y-2">
              {ratingBreakdown.map(item => <div key={item.stars} className="flex items-center">
                  <div className="w-8 text-sm text-gray-600">{item.stars}</div>
                  <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{
                  width: `${item.percentage}%`
                }}></div>
                  </div>
                  <div className="w-8 text-sm text-gray-600 text-right">
                    {item.percentage}%
                  </div>
                </div>)}
            </div>
          </div>
          {/* Category Ratings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Category Ratings
            </h3>
            <div className="space-y-2">
              {categoryRatings.map(item => <div key={item.name} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-1">
                      {item.rating}
                    </span>
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
      {/* Individual Reviews */}
      <div className="space-y-6">
        {displayedReviews.map(review => <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <img src={review.reviewer.image} alt={review.reviewer.name} className="h-10 w-10 rounded-full mr-3" />
              <div>
                <div className="font-medium text-gray-900">
                  {review.reviewer.name}
                </div>
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center mb-1">
                {Array.from({
              length: 5
            }).map((_, i) => <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
              </div>
              <div className="text-sm text-gray-600">
                Event Type: {review.eventType}
              </div>
            </div>
            <p className="text-gray-700 mb-4">{review.comment}</p>
            {/* Venue Response (if any) */}
            {review.venueResponse && <div className="bg-gray-50 p-4 rounded-md border-l-4 border-indigo-500">
                <div className="font-medium text-gray-900 mb-1">
                  Response from{' '}
                  {review.venueResponse.includes('Thank you') ? 'venue' : 'venue manager'}
                </div>
                <p className="text-gray-600 text-sm">{review.venueResponse}</p>
              </div>}
          </div>)}
      </div>
      {/* Load More Reviews */}
      {reviews.length > 3 && <div className="mt-6 text-center">
          <button onClick={() => setShowAllReviews(!showAllReviews)} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            {showAllReviews ? 'Show Less' : `Load ${reviews.length - 3} More Reviews`}
          </button>
        </div>}
      {/* Write a Review */}
      <div className="mt-8 text-center">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          <MessageCircleIcon className="h-4 w-4 mr-2" />
          Write a Review
        </button>
      </div>
    </section>;
};