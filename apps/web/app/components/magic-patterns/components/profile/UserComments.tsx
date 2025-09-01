import React, { useState } from 'react';
import { StarIcon, ThumbsUpIcon, ThumbsDownIcon, FlagIcon, MessageSquareIcon, SendIcon } from 'lucide-react';
// Mock data for user comments/reviews
const mockComments = [{
  id: 'comment-1',
  type: 'venue',
  targetName: 'Capitol Theatre',
  targetId: 'venue-1',
  rating: 5,
  content: "Amazing venue with great acoustics! I've been to several shows here and have always had a wonderful experience. The staff is friendly and the seating is comfortable.",
  date: '2024-07-15T18:30:00Z',
  likes: 12,
  dislikes: 1,
  replies: [{
    id: 'reply-1',
    author: 'Jane Smith',
    authorId: 'user-456',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    content: 'I completely agree! Their sound system is top notch.',
    date: '2024-07-16T09:45:00Z',
    likes: 3
  }]
}, {
  id: 'comment-2',
  type: 'event',
  targetName: 'Clearwater Jazz Holiday',
  targetId: 'event-1',
  rating: 4,
  content: 'Had a great time at the Jazz Holiday last year. The lineup was fantastic and the atmosphere was perfect. Only giving 4 stars because the food options were a bit limited.',
  date: '2024-06-28T20:15:00Z',
  likes: 8,
  dislikes: 0,
  replies: []
}, {
  id: 'comment-3',
  type: 'performer',
  targetName: 'The Sunset Vibes',
  targetId: 'performer-1',
  rating: 5,
  content: 'Saw them live last weekend and was blown away! Their energy on stage is infectious and they sound even better live than on their recordings. Highly recommend catching one of their shows if you can.',
  date: '2024-08-02T22:10:00Z',
  likes: 15,
  dislikes: 0,
  replies: [{
    id: 'reply-2',
    author: 'Concert Lover',
    authorId: 'user-789',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    content: "I've got tickets for their show next month. Can't wait!",
    date: '2024-08-03T10:20:00Z',
    likes: 2
  }, {
    id: 'reply-3',
    author: 'Music Fan',
    authorId: 'user-101',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    content: 'Their new album is fantastic too. You should check it out!',
    date: '2024-08-03T15:45:00Z',
    likes: 1
  }]
}, {
  id: 'comment-4',
  type: 'venue',
  targetName: 'Coachman Park',
  targetId: 'venue-2',
  rating: 4,
  content: 'Beautiful park with a great view of the water. Perfect for outdoor concerts and events. The recent renovations have made it even better.',
  date: '2024-07-10T16:30:00Z',
  likes: 9,
  dislikes: 1,
  replies: []
}, {
  id: 'comment-5',
  type: 'event',
  targetName: 'Art Walk',
  targetId: 'event-3',
  rating: 5,
  content: "The monthly Art Walk is one of my favorite events in Clearwater. So many talented local artists and a fun, relaxed atmosphere. Don't miss it!",
  date: '2024-07-22T21:00:00Z',
  likes: 11,
  dislikes: 0,
  replies: []
}];
type UserCommentsProps = {
  userId: string;
};
export const UserComments = ({
  userId
}: UserCommentsProps) => {
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const handleReply = (commentId: string) => {
    console.log(`Replying to comment ${commentId}: ${replyText}`);
    setReplyText('');
    setActiveComment(null);
  };
  // Sort comments based on selected criteria
  const sortedComments = [...mockComments].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.likes - a.likes;
    }
  });
  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) {
      return 'just now';
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  };
  // Get badge color based on comment type
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'venue':
        return 'bg-blue-100 text-blue-800';
      case 'event':
        return 'bg-green-100 text-green-800';
      case 'performer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Comments & Reviews
        </h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Sort by:</span>
          <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" value={sortBy} onChange={e => setSortBy(e.target.value as 'recent' | 'popular')}>
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>
      <div className="space-y-6">
        {sortedComments.length === 0 ? <div className="text-center py-8 bg-gray-50 rounded-lg">
            <MessageSquareIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No comments yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              This user hasn't left any comments or reviews.
            </p>
          </div> : sortedComments.map(comment => <div key={comment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(comment.type)}`}>
                      {comment.type.charAt(0).toUpperCase() + comment.type.slice(1)}{' '}
                      Review
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {formatRelativeTime(comment.date)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-4 w-4 ${i < comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">
                  {comment.targetName}
                </h3>
                <p className="text-gray-700 text-sm">{comment.content}</p>
                <div className="mt-3 flex items-center text-sm">
                  <button className="inline-flex items-center text-gray-500 hover:text-gray-700">
                    <ThumbsUpIcon className="h-4 w-4 mr-1" />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="inline-flex items-center ml-4 text-gray-500 hover:text-gray-700">
                    <ThumbsDownIcon className="h-4 w-4 mr-1" />
                    <span>{comment.dislikes}</span>
                  </button>
                  <button className="inline-flex items-center ml-4 text-gray-500 hover:text-gray-700" onClick={() => setActiveComment(activeComment === comment.id ? null : comment.id)}>
                    <MessageSquareIcon className="h-4 w-4 mr-1" />
                    <span>Reply</span>
                  </button>
                  <button className="inline-flex items-center ml-4 text-gray-500 hover:text-gray-700">
                    <FlagIcon className="h-4 w-4 mr-1" />
                    <span>Report</span>
                  </button>
                </div>
              </div>
              {/* Comment Replies */}
              {comment.replies.length > 0 && <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Replies
                  </h4>
                  <div className="space-y-3">
                    {comment.replies.map(reply => <div key={reply.id} className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <img className="h-8 w-8 rounded-full" src={reply.authorAvatar} alt={reply.author} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center text-sm">
                            <span className="font-medium text-gray-900">
                              {reply.author}
                            </span>
                            <span className="ml-2 text-gray-500 text-xs">
                              {formatRelativeTime(reply.date)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {reply.content}
                          </p>
                          <div className="mt-1 flex items-center text-xs">
                            <button className="inline-flex items-center text-gray-500 hover:text-gray-700">
                              <ThumbsUpIcon className="h-3 w-3 mr-1" />
                              <span>{reply.likes}</span>
                            </button>
                            <button className="inline-flex items-center ml-3 text-gray-500 hover:text-gray-700">
                              <FlagIcon className="h-3 w-3 mr-1" />
                              <span>Report</span>
                            </button>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>}
              {/* Reply Form */}
              {activeComment === comment.id && <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Your avatar" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="relative rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                        <textarea rows={2} className="block w-full py-2 px-3 border-0 resize-none focus:ring-0 sm:text-sm" placeholder="Add a reply..." value={replyText} onChange={e => setReplyText(e.target.value)}></textarea>
                        <div className="py-2 px-3 border-t border-gray-200 flex justify-end">
                          <button type="button" className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => handleReply(comment.id)} disabled={!replyText.trim()}>
                            <SendIcon className="h-3 w-3 mr-1" />
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>}
            </div>)}
      </div>
    </div>;
};