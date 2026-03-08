'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Post, Comment } from '@/types/database';
import { Loader2, MoreVertical, Heart, MessageCircle, Share2, CornerDownRight, X, ChevronLeft, ChevronRight, Trash2, BarChart2, Send } from 'lucide-react';
import { formatNumber, parseContent } from '@/lib/format';
import { SmartImage } from '@/components/ui/SmartImage';
import { useToast } from '@/hooks/use-toast';
import { createPortal } from 'react-dom';

interface PostDetailPanelProps {
    post: Post;
    comments: Comment[];
    loadingComments?: boolean;
    currentUserId?: string;
    onClose: () => void;
    onLikePost: () => void;
    onSharePost: () => void;
    onDeletePost: () => void;
    onEditPost: () => void;
    onLikeComment: (commentId: string) => void;
    onDeleteComment: (commentId: string) => void;
    onSubmitComment: (content: string, replyToId?: string) => Promise<void>;
}

export const PostDetailPanel: React.FC<PostDetailPanelProps> = ({
    post,
    comments,
    loadingComments,
    currentUserId,
    onClose,
    onLikePost,
    onSharePost,
    onDeletePost,
    onEditPost,
    onLikeComment,
    onDeleteComment,
    onSubmitComment
}) => {
    const { toast } = useToast();
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [showOptionsTarget, setShowOptionsTarget] = useState<'post' | string | null>(null);

    const [visibleCommentsCount, setVisibleCommentsCount] = useState(30);
    const [visibleRepliesCount, setVisibleRepliesCount] = useState<Record<string, number>>({});
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Disable background scroll when image viewer is open
    useEffect(() => {
        if (selectedImageIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedImageIndex]);

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (post.images && selectedImageIndex !== null && selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (post.images && selectedImageIndex !== null && selectedImageIndex < post.images.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };

    const postContent = parseContent(post.content);
    const isOwner = currentUserId && post.user_id === currentUserId;

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || submitting) return;
        setSubmitting(true);
        try {
            await onSubmitComment(newComment, replyingTo?.id);
            setNewComment('');
            setReplyingTo(null);
        } finally {
            setSubmitting(false);
        }
    };

    const renderComment = (comment: Comment, isReply = false) => {
        const commentOwner = currentUserId === comment.user_id;

        return (
            <div key={comment.id} className="relative mb-4">

                <div className="flex gap-3 relative z-10">
                    <div className={`rounded-full bg-gray-100 shrink-0 relative overflow-hidden mt-1 ${isReply ? 'w-6 h-6' : 'w-8 h-8'}`}>
                        <SmartImage src={comment.user?.avatar_url || 'https://via.placeholder.com/40'} alt="avatar" className="object-cover" fallbackIconSize={16} />
                    </div>
                    <div className="flex-1">
                        <div className="bg-gray-50 rounded-2xl px-4 py-3 relative group">
                            <div className="flex justify-between items-start mb-1">
                                <h5 className="text-sm font-semibold text-gray-900">{comment.user?.name}</h5>

                                {commentOwner && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowOptionsTarget(showOptionsTarget === comment.id ? null : comment.id)}
                                            className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                        >
                                            <MoreVertical size={16} />
                                        </button>

                                        {showOptionsTarget === comment.id && (
                                            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden z-[100]">
                                                <button
                                                    onClick={() => { onDeleteComment(comment.id); setShowOptionsTarget(null); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{parseContent(comment.content)}</p>
                        </div>

                        <div className="flex items-center gap-4 mt-2 px-3">
                            <span className="text-xs text-gray-400 font-medium">
                                {new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>

                            <button onClick={() => onLikeComment(comment.id)} className={`text-xs font-semibold hover:opacity-80 transition-colors ${comment.user_has_liked ? 'text-red-400' : 'text-gray-500'}`}>
                                {comment.likes_count > 0 ? `${comment.likes_count} Likes` : 'Like'}
                            </button>

                            {!isReply && (
                                <button onClick={() => setReplyingTo(comment)} className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors">
                                    Reply
                                </button>
                            )}
                        </div>

                        {/* render replies */}
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-2 relative pl-8 sm:pl-11 bg-white">
                                {comment.replies.slice(0, visibleRepliesCount[comment.id] || 3).map((reply) => {
                                    return (
                                        <div key={reply.id} className="relative pt-2">
                                            <div className="relative z-10">
                                                {renderComment(reply, true)}
                                            </div>
                                        </div>
                                    );
                                })}

                                {comment.replies.length > 5 && (
                                    <div className="pt-2">
                                        {(visibleRepliesCount[comment.id] || 5) < (comment.replies?.length || 0) ? (
                                            <button
                                                onClick={() => setVisibleRepliesCount(prev => ({ ...prev, [comment.id]: (prev[comment.id] || 3) + 30 }))}
                                                className="text-[#3c2a34] font-semibold text-xs hover:underline"
                                            >
                                                Load more replies...
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setVisibleRepliesCount(prev => ({ ...prev, [comment.id]: 3 }))}
                                                className="text-[#3c2a34] font-semibold text-xs hover:underline"
                                            >
                                                See less
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white lg:rounded-2xl overflow-hidden relative border-none lg:border-solid lg:border lg:border-gray-200">
            {/* Header Navbar */}
            <div className="h-[60px] flex items-center justify-between px-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
                <button
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft size={24} className="text-gray-700" />
                </button>
                <h2 className="text-lg font-bold text-gray-900">Post</h2>

                <div className="relative">
                    {isOwner ? (
                        <>
                            <button
                                onClick={() => setShowOptionsTarget(showOptionsTarget === 'post' ? null : 'post')}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <MoreVertical size={20} className="text-gray-700" />
                            </button>
                            {showOptionsTarget === 'post' && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-1 z-30">
                                    <button
                                        onClick={() => { onEditPost(); setShowOptionsTarget(null); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium border-b border-gray-50"
                                    >
                                        Edit Post
                                    </button>
                                    <button
                                        onClick={() => { onDeletePost(); setShowOptionsTarget(null); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                                    >
                                        <Trash2 size={16} /> Delete Post
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-10" /> // Spacer
                    )}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                <div className="p-5">
                    {/* Post Author */}
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden mr-3 shrink-0 relative">
                            <SmartImage src={post.user?.avatar_url || 'https://via.placeholder.com/40'} alt="avatar" className="object-cover" fallbackIconSize={24} />
                        </div>
                        <div>
                            <h4 className="text-[16px] font-bold text-gray-900 leading-tight">
                                {post.user?.name || 'Anonymous'}
                            </h4>
                            <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                {post.community && <span className="font-semibold mr-1">{post.community.name} •</span>}
                                <span> {new Date(post.created_at).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric'
                                })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    {post.title && <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>}
                    <p className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-line mb-4">
                        {postContent}
                    </p>

                    {/* Media */}
                    {post.images && post.images.length > 0 && (
                        <div className="relative mb-4 group/media">
                            <div ref={scrollContainerRef} className="flex overflow-x-auto gap-3 pb-2 w-full custom-scrollbar snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                                {post.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`h-[250px] sm:h-[300px] bg-gray-100 rounded-xl overflow-hidden relative shrink-0 snap-center cursor-pointer hover:opacity-95 transition-opacity ${post.images!.length > 1 ? 'w-[90%] sm:w-[85%]' : 'w-full'
                                            }`}
                                    >
                                        <SmartImage src={img.image_url} alt="Post media" className="object-cover" fallbackIconSize={48} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center gap-8 py-3 border-y border-gray-100 mb-6">
                        <button onClick={onLikePost} className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
                            <Heart size={22} className={`transition-colors duration-200 ${post.user_has_liked ? 'fill-red-400 text-red-400' : 'text-gray-500 group-hover:text-red-400'}`} />
                            <span className={`text-sm font-semibold ${post.user_has_liked ? 'text-red-400' : 'text-gray-500'}`}>{formatNumber(post.likes_count)}</span>
                        </button>
                        <div className="flex items-center gap-2 text-gray-500 cursor-default">
                            <MessageCircle size={22} />
                            <span className="text-sm font-semibold">{formatNumber(post.comments_count)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 cursor-default">
                            <BarChart2 size={22} />
                            <span className="text-sm font-semibold">{formatNumber(post.views_count)}</span>
                        </div>
                        <button onClick={onSharePost} className="flex items-center gap-2 group hover:opacity-80 transition-opacity ml-auto">
                            <Share2 size={22} className="text-gray-500 group-hover:text-green-500" />
                        </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-2 pb-6">
                        {loadingComments ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 italic">No comments yet. Be the first to share your thoughts!</div>
                        ) : (
                            <>
                                {comments.slice(0, visibleCommentsCount).map(c => renderComment(c))}
                                {comments.length > visibleCommentsCount && (
                                    <button
                                        onClick={() => setVisibleCommentsCount(prev => prev + 30)}
                                        className="text-[#3c2a34] font-semibold text-sm hover:underline mt-4 w-full text-center"
                                    >
                                        Load more comments...
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Input Area */}
            <div className="bg-white border-t border-gray-100 p-3 shrink-0 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] z-10">
                {replyingTo && (
                    <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-t-xl text-xs">
                        <span className="font-medium text-gray-600">Replying to {replyingTo.user?.name}</span>
                        <button onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-gray-600">
                            <X size={14} />
                        </button>
                    </div>
                )}
                <div className={`flex items-center gap-2 bg-gray-100 pl-4 pr-1 py-1 ${replyingTo ? 'rounded-b-2xl' : 'rounded-full'}`}>
                    <input
                        className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-500 outline-none h-10"
                        placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleCommentSubmit();
                            }
                        }}
                        disabled={submitting}
                    />
                    <button
                        onClick={handleCommentSubmit}
                        disabled={!newComment.trim() || submitting}
                        className={`w-10 h-10 flex items-center justify-center rounded-full shrink-0 transition-colors ${newComment.trim() ? 'bg-[#3c2a34] text-white shadow-md hover:bg-[#2a1c24]' : 'bg-transparent text-gray-400'
                            }`}
                    >
                        {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={18} className="translate-x-[1px]" />}
                    </button>
                </div>
            </div>

            {/* Full Screen Image Viewer via Portal */}
            {selectedImageIndex !== null && post.images && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/10 backdrop-blur-md">

                    {/* Close Button */}
                    <button
                        onClick={() => setSelectedImageIndex(null)}
                        className="absolute top-6 right-6 z-[100000] p-3 bg-[#3c2a34]/90 hover:bg-[#3c2a34]/80 text-white rounded-full transition"
                    >
                        <X size={28} />
                    </button>

                    {/* Image Modal */}
                    <div className="relative w-full h-full flex items-center justify-center">

                        {/* Prev Button */}
                        {selectedImageIndex > 0 && (
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-6 top-1/2 -translate-y-1/2 z-[100000] p-3 bg-gray-300 hover:bg-gray-400 text-white rounded-full transition"
                            >
                                <ChevronLeft size={36} />
                            </button>
                        )}

                        {/* Image */}
                        <div className="relative w-[90vw] h-[90vh] flex items-center justify-center">

                            <SmartImage
                                src={post.images[selectedImageIndex].image_url}
                                alt="Media full"
                                className="object-contain w-full h-full bg-transparent"
                                priority
                                fallbackIconSize={64}
                            />

                        </div>

                        {/* Next Button */}
                        {selectedImageIndex < post.images.length - 1 && (
                            <button
                                onClick={handleNextImage}
                                className="absolute right-6 top-1/2 -translate-y-1/2 z-[100000] p-3 bg-gray-300 hover:bg-gray-400 text-white rounded-full transition"
                            >
                                <ChevronRight size={36} />
                            </button>
                        )}

                    </div>

                </div>,
                document.body
            )}
        </div>
    );
};
