'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Heart,
  ThumbsUp,
  PartyPopper,
  ShieldCheck,
  Lightbulb,
  HelpCircle,
  MessageSquare,
  Share2,
  Trash2,
  Send,
  CornerDownRight,
  User,
  Sparkles,
} from 'lucide-react';
import { CommunityPostDTO, CommunityCommentDTO, ReactionType } from '@/types/communities';
import { apiClient } from '@/lib/api';
import { notify } from '@/components/ui/toast';
import { useAuth } from '@/context/auth-context';
import { formatShortDate } from '@/lib/date-utils';

interface CommunityPostCardProps {
  post: CommunityPostDTO;
  isMember: boolean;
  onPostDeleted?: (postId: string) => void;
}

const REACTIONS: { type: ReactionType; label: string; icon: string; color: string }[] = [
  { type: 'like', label: 'Like', icon: '👍', color: 'text-blue-600' },
  { type: 'love', label: 'Love', icon: '❤️', color: 'text-rose-600' },
  { type: 'celebrate', label: 'Celebrate', icon: '👏', color: 'text-amber-600' },
  { type: 'support', label: 'Support', icon: '🤝', color: 'text-emerald-600' },
  { type: 'insightful', label: 'Insightful', icon: '💡', color: 'text-purple-600' },
  { type: 'curious', label: 'Curious', icon: '🤔', color: 'text-indigo-600' },
];

function formatCount(num: number): string {
  if (!num || num <= 0) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(num);
}

export default function CommunityPostCard({
  post,
  isMember,
  onPostDeleted,
}: CommunityPostCardProps) {
  const { user } = useAuth();
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(post.viewerReaction);
  const [reactionSummary, setReactionSummary] = useState(post.reactionSummary);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommunityCommentDTO[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const isAuthor = user?.id === post.author.id;

  // Toggle reaction with optimistic UI
  const handleSelectReaction = async (type: ReactionType) => {
    if (!user) {
      notify.error('Please log in to react to posts.');
      return;
    }
    if (!isMember) {
      notify.error('You must join this community to react to discussions.');
      return;
    }

    setShowReactionPicker(false);
    const prevReaction = currentReaction;
    const prevSummary = { ...reactionSummary };

    // Optimistic calculation
    const newSummary = { ...reactionSummary };
    if (prevReaction) {
      newSummary[prevReaction] = Math.max(0, newSummary[prevReaction] - 1);
      newSummary.total = Math.max(0, newSummary.total - 1);
    }
    const isTogglingOff = prevReaction === type;
    if (!isTogglingOff) {
      newSummary[type] = (newSummary[type] || 0) + 1;
      newSummary.total += 1;
    }

    setCurrentReaction(isTogglingOff ? null : type);
    setReactionSummary(newSummary);

    try {
      const res = await apiClient<{ userReaction: ReactionType | null; totalReactions: number }>(
        `/communities/posts/${post.id}/reaction`,
        {
          method: 'PUT',
          body: JSON.stringify({ reactionType: type }),
        }
      );
      if (res.success && res.data) {
        setCurrentReaction(res.data.userReaction);
      }
    } catch {
      // Revert on error
      setCurrentReaction(prevReaction);
      setReactionSummary(prevSummary);
      notify.error('Unable to update reaction.');
    }
  };

  // Toggle comments
  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setIsLoadingComments(true);
      try {
        const res = await apiClient<CommunityCommentDTO[]>(`/communities/posts/${post.id}/comments`);
        if (res.success && res.data) {
          setComments(res.data);
        }
      } catch (err) {
        console.warn('Error fetching comments:', err);
      } finally {
        setIsLoadingComments(false);
      }
    }
    setShowComments((prev) => !prev);
  };

  // Submit comment
  const handleSubmitComment = async (parentCommentId?: string) => {
    const text = parentCommentId ? replyInput.trim() : commentInput.trim();
    if (!text) return;

    if (!user) {
      notify.error('Please log in to comment.');
      return;
    }
    if (!isMember) {
      notify.error('You must join this community to comment.');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const res = await apiClient<CommunityCommentDTO>(`/communities/posts/${post.id}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          body: text,
          parentCommentId: parentCommentId || null,
        }),
      });

      if (res.success && res.data) {
        if (parentCommentId) {
          setComments((prev) =>
            prev.map((c) => {
              if (c.id === parentCommentId) {
                return { ...c, replies: [...(c.replies || []), res.data!] };
              }
              return c;
            })
          );
          setReplyingToCommentId(null);
          setReplyInput('');
        } else {
          setComments((prev) => [...prev, res.data!]);
          setCommentInput('');
        }
        notify.success('Comment posted successfully');
      } else {
        notify.error(res.error?.message || 'Failed to post comment');
      }
    } catch {
      notify.error('Error posting comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this discussion post?')) return;
    try {
      const res = await apiClient(`/communities/posts/${post.id}`, { method: 'DELETE' });
      if (res.success) {
        notify.success('Post deleted successfully');
        if (onPostDeleted) onPostDeleted(post.id);
      }
    } catch {
      notify.error('Failed to delete post');
    }
  };

  const totalCommentCount = Math.max(post.commentCount, comments.length);

  return (
    <article className="rounded-none sm:rounded-xl border-x-0 border-t-0 sm:border border-b border-[#ded5cd] bg-white px-4 py-4 sm:p-5 text-foreground transition-all">
      {/* Post Author Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="relative w-10 h-10 rounded-full bg-[#faf8f6] border border-[#ded9d5] flex items-center justify-center overflow-hidden shrink-0">
            {post.author.avatarUrl ? (
              <Image
                src={post.author.avatarUrl}
                alt={post.author.displayName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <User size={18} className="text-primary-text" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[14px] sm:text-[15px] font-bold text-foreground">
                {post.author.displayName}
              </span>
              {post.category && (
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#faf7f5] text-primary border border-[#f0ece9]">
                  {post.category.name}
                </span>
              )}
              {post.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                  <Sparkles size={10} />
                  <span>Featured</span>
                </span>
              )}
            </div>

            <p className="text-[11.5px] sm:text-[12px] text-primary-text/80 line-clamp-1">
              {post.author.headline || 'Healthcare Professional'} ·{' '}
              <span suppressHydrationWarning>{formatShortDate(post.createdAt)}</span>
            </p>
          </div>
        </div>

        {isAuthor && (
          <button
            type="button"
            onClick={handleDeletePost}
            className="p-1.5 text-primary-text/60 hover:text-red-600 transition-colors cursor-pointer"
            title="Delete post"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Post Title */}
      {post.title && (
        <h4 className="mt-3 text-[16px] sm:text-[17px] font-bold text-foreground leading-snug">
          {post.title}
        </h4>
      )}

      {/* Post Body (Unified P typography: lg-15px, md-14px, on mobile 13px) */}
      <div className="mt-2.5 text-[13px] md:text-[14px] lg:text-[15px] text-primary-text leading-relaxed whitespace-pre-line">
        {post.body}
      </div>

      {/* Post Media / Images */}
      {post.media && post.media.length > 0 && (
        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {post.media.map((m) => (
            <div
              key={m.id}
              className="relative aspect-video rounded-lg overflow-hidden border border-[#ded9d5] bg-[#faf8f6]"
            >
              <Image
                src={m.cloudinaryUrl}
                alt="Post visual"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}

      {/* Clean Merged Bottom Bar: Inline Side-by-Side (Like + Count, Comment + Count, Share) */}
      <div className="relative pt-3 mt-3 border-t border-[#f0ece9] flex items-center gap-1.5 sm:gap-2">
        {/* Like / Reaction Button */}
        <div className="relative" onMouseLeave={() => setShowReactionPicker(false)}>
          <button
            type="button"
            onClick={() => handleSelectReaction(currentReaction || 'like')}
            onMouseEnter={() => setShowReactionPicker(true)}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[12.5px] sm:text-[13px] font-semibold transition-colors cursor-pointer ${
              currentReaction
                ? 'text-primary bg-[#faf0f8] border border-primary/20'
                : 'text-primary-text hover:text-foreground hover:bg-[#faf8f6]'
            }`}
          >
            {currentReaction ? (
              <span className="text-[14px]">
                {REACTIONS.find((r) => r.type === currentReaction)?.icon || '👍'}
              </span>
            ) : (
              <ThumbsUp size={14} className="text-primary-text" />
            )}
            <span className="font-bold text-foreground">
              {formatCount(reactionSummary.total)}
            </span>
            <span className="hidden sm:inline font-medium text-primary-text/80">
              {currentReaction ? REACTIONS.find((r) => r.type === currentReaction)?.label : 'Likes'}
            </span>
          </button>

          {/* Reaction Picker Popover */}
          {showReactionPicker && (
            <div className="absolute left-0 bottom-full mb-1 flex items-center gap-1.5 p-1.5 rounded-full bg-white border border-[#ded5cd] shadow-lg z-20">
              {REACTIONS.map((r) => (
                <button
                  key={r.type}
                  type="button"
                  onClick={() => handleSelectReaction(r.type)}
                  className="p-1 text-[17px] hover:scale-125 transition-transform cursor-pointer"
                  title={r.label}
                >
                  {r.icon}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment Button with count */}
        <button
          type="button"
          onClick={handleToggleComments}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[12.5px] sm:text-[13px] font-semibold text-primary-text hover:text-foreground hover:bg-[#faf8f6] transition-colors cursor-pointer"
        >
          <MessageSquare size={14} />
          <span className="font-bold text-foreground">
            {formatCount(totalCommentCount)}
          </span>
          <span className="hidden sm:inline font-medium text-primary-text/80">
            Comments
          </span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              navigator.clipboard?.writeText(window.location.href);
              notify.success('Post link copied to clipboard');
            }
          }}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[12.5px] sm:text-[13px] font-semibold text-primary-text hover:text-foreground hover:bg-[#faf8f6] transition-colors cursor-pointer"
        >
          <Share2 size={14} />
          <span className="hidden sm:inline font-medium text-primary-text/80">
            Share
          </span>
        </button>
      </div>

      {/* Threaded Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-[#f0ece9] space-y-4">
          {/* Main Comment Composer */}
          {isMember ? (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && void handleSubmitComment()}
                  placeholder="Add a clinical observation or question..."
                  className="w-full px-3.5 py-2 text-[13px] rounded-lg border border-[#ded9d5] bg-[#faf8f6] text-foreground placeholder:text-primary-text/70 outline-none focus:border-primary focus:bg-white"
                />
                <button
                  type="button"
                  disabled={!commentInput.trim() || isSubmittingComment}
                  onClick={() => void handleSubmitComment()}
                  className="px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-[13px] font-semibold transition-all shrink-0 cursor-pointer"
                >
                  Post
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 text-center rounded-lg bg-[#faf8f6] text-[12.5px] text-primary-text">
              Join this community to participate in comments and discussions.
            </div>
          )}

          {/* Comments List */}
          {isLoadingComments ? (
            <div className="space-y-3 pt-2" aria-busy="true" aria-label="Loading comments">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#faf8f6] animate-shimmer shrink-0 border border-[#f0ece9]" />
                  <div className="flex-1 bg-[#faf8f6] p-3 rounded-lg border border-[#f0ece9] space-y-2">
                    <div className="h-3.5 w-32 rounded bg-[#f0ebe6] animate-shimmer" />
                    <div className="h-3.5 w-5/6 rounded bg-[#f0ebe6] animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-3.5 pt-2">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#f0ebe6] text-primary flex items-center justify-center shrink-0 text-[11px] font-bold">
                      {comment.author.displayName?.[0] || 'A'}
                    </div>
                    <div className="flex-1 bg-[#faf8f6] p-3.5 rounded-lg border border-[#f0ece9]">
                      <div className="flex items-center justify-between">
                        <span className="text-[13.5px] font-bold text-foreground">
                          {comment.author.displayName}
                        </span>
                        <span className="text-[11.5px] text-primary-text/70" suppressHydrationWarning>
                          {formatShortDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px] md:text-[14px] lg:text-[15px] text-primary-text leading-relaxed">
                        {comment.body}
                      </p>

                      {isMember && (
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setReplyingToCommentId(
                                replyingToCommentId === comment.id ? null : comment.id
                              )
                            }
                            className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-primary hover:underline cursor-pointer"
                          >
                            <CornerDownRight size={11} />
                            <span>Reply</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reply Composer if replying to this comment */}
                  {replyingToCommentId === comment.id && (
                    <div className="ml-9 flex gap-2 pt-1">
                      <input
                        type="text"
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && void handleSubmitComment(comment.id)}
                        placeholder="Write a reply..."
                        className="w-full px-3 py-1.5 text-[12.5px] rounded-lg border border-[#ded9d5] bg-white text-foreground outline-none focus:border-primary"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => void handleSubmitComment(comment.id)}
                        disabled={!replyInput.trim() || isSubmittingComment}
                        className="px-3 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  )}

                  {/* Nested Replies (Depth 1 & 2) */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-9 space-y-2 pt-1 border-l-2 border-[#f0ece9] pl-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#f0ebe6] text-primary flex items-center justify-center shrink-0 text-[10px] font-bold">
                            {reply.author.displayName?.[0] || 'R'}
                          </div>
                          <div className="flex-1 bg-white p-2.5 rounded-lg border border-[#f0ece9]">
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] font-bold text-foreground">
                                {reply.author.displayName}
                              </span>
                              <span className="text-[10.5px] text-primary-text/70" suppressHydrationWarning>
                                {formatShortDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[13px] md:text-[13.5px] lg:text-[14px] text-primary-text leading-relaxed">
                              {reply.body}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[12px] text-primary-text py-2">
              No comments yet. Be the first to start the conversation!
            </p>
          )}
        </div>
      )}
    </article>
  );
}
