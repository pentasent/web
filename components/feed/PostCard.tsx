import React from 'react';
import { Heart, MessageCircle, Share2, BarChart2 } from 'lucide-react';
import { Post } from '@/types/database';
import { formatNumber, parseContent } from '@/lib/format';
import { SmartImage } from '@/components/ui/SmartImage';

interface PostCardProps {
    post: Post;
    onPress: () => void;
    onLike: (e: React.MouseEvent) => void;
    onComment: (e: React.MouseEvent) => void;
    onShare: (e: React.MouseEvent) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
    post,
    onPress,
    onLike,
    onComment,
    onShare
}) => {
    const postContent = parseContent(post.content);

    return (
        <div
            className="bg-white border hover:border-gray-200 border-transparent rounded-[20px] shadow-sm mb-4 cursor-pointer overflow-hidden transition-all duration-200"
            onClick={onPress}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden mr-3 shrink-0 relative">
                        <SmartImage
                            src={post.user?.avatar_url || 'https://via.placeholder.com/40'}
                            alt="avatar"
                            className="object-cover"
                            fallbackIconSize={20}
                        />
                    </div>
                    <div>
                        <h4 className="text-[15px] font-semibold text-gray-900 leading-none mb-1">
                            {post.user?.name || 'Anonymous'}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500">
                            {post.community && (
                                <span className="font-medium mr-1">{post.community.name} •</span>
                            )}
                            <span>
                                {new Date(post.created_at).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-5 mb-3">
                {post.title && (
                    <h3 className="text-base font-bold text-gray-900 mb-1">{post.title}</h3>
                )}
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 whitespace-pre-line">
                    {postContent}
                </p>
            </div>

            {/* Media */}
            {post.images && post.images.length > 0 && (
                <div className="mt-1 flex overflow-x-auto gap-2 pb-2 px-5 custom-scrollbar snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                    {post.images.map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative h-[300px] sm:h-[400px] bg-gray-100 rounded-xl overflow-hidden shrink-0 snap-center ${post.images!.length > 1 ? 'w-[90%] sm:w-[85%]' : 'w-full'
                                }`}
                        >
                            <SmartImage
                                src={img.image_url}
                                alt={`Post media ${idx}`}
                                className="object-cover"
                                fallbackIconSize={48}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 px-5 py-3 border-t border-gray-50">
                <button
                    onClick={onLike}
                    className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
                >
                    <Heart
                        size={20}
                        className={`transition-colors duration-200 ${post.user_has_liked
                            ? 'fill-red-400 text-red-400'
                            : 'text-gray-500 group-hover:text-red-400'
                            }`}
                    />
                    <span
                        className={`text-sm font-medium ${post.user_has_liked ? 'text-red-400' : 'text-gray-500'
                            }`}
                    >
                        {post.likes_count > 0 ? formatNumber(post.likes_count) : 'Like'}
                    </span>
                </button>

                <button
                    onClick={onComment}
                    className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
                >
                    <MessageCircle
                        size={20}
                        className="text-gray-500 group-hover:text-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-500 group-hover:text-blue-500 transition-colors">
                        {post.comments_count > 0 ? formatNumber(post.comments_count) : 'Comment'}
                    </span>
                </button>

                <div className="flex items-center gap-2 text-gray-500 cursor-default">
                    <BarChart2 size={20} />
                    <span className="text-sm font-medium">
                        {post.views_count > 0 ? formatNumber(post.views_count) : 'View'}
                    </span>
                </div>

                <button
                    onClick={onShare}
                    className="flex items-center gap-2 group hover:opacity-80 transition-opacity ml-auto"
                >
                    <Share2 size={20} className="text-gray-500 group-hover:text-green-500" />
                </button>
            </div>
        </div>
    );
};
