'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { MessageSquare, Reply, Trash2, Send, Loader2, Sparkles, Check } from 'lucide-react';
import { ProductCommentDTO } from '@/types/products';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api';
import { notify } from '@/components/ui/toast';

interface ProductDiscussionsProps {
  productId: string;
  comments: ProductCommentDTO[];
}

export default function ProductDiscussions({ productId, comments: initialComments }: ProductDiscussionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [commentsList, setCommentsList] = useState<ProductCommentDTO[]>(initialComments);
  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Top-level comment submission
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname || '')}`);
      return;
    }

    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await apiClient<ProductCommentDTO>(`/products/${productId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ body: commentText.trim() }),
      });

      if (res.success && res.data) {
        setCommentsList((prev) => [res.data, ...prev]);
        setCommentText('');
        notify.success('Comment posted successfully');
      } else {
        notify.error(res.error?.message || 'Failed to post comment');
      }
    } catch (err) {
      notify.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reply submission
  const handlePostReply = async (parentCommentId: string) => {
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname || '')}`);
      return;
    }

    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await apiClient<ProductCommentDTO>(`/products/${productId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ body: replyText.trim(), parentCommentId }),
      });

      if (res.success && res.data) {
        // Find and attach to parent in list
        const addReply = (list: ProductCommentDTO[]): ProductCommentDTO[] => {
          return list.map((c) => {
            if (c.id === parentCommentId) {
              return { ...c, replies: [...(c.replies || []), res.data] };
            }
            if (c.replies && c.replies.length > 0) {
              return { ...c, replies: addReply(c.replies) };
            }
            return c;
          });
        };

        setCommentsList(addReply(commentsList));
        setReplyingToId(null);
        setReplyText('');
        notify.success('Reply posted');
      } else {
        notify.error(res.error?.message || 'Failed to post reply');
      }
    } catch (err) {
      notify.error('Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete comment
  const handleDelete = async (commentId: string) => {
    try {
      const res = await apiClient<{ deleted: boolean }>(`/products/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (res.success) {
        const removeComment = (list: ProductCommentDTO[]): ProductCommentDTO[] => {
          return list
            .filter((c) => c.id !== commentId)
            .map((c) => ({
              ...c,
              replies: c.replies ? removeComment(c.replies) : [],
            }));
        };

        setCommentsList(removeComment(commentsList));
        notify.success('Comment removed');
      } else {
        notify.error('Failed to remove comment');
      }
    } catch {
      notify.error('Failed to remove comment');
    }
  };

  // Recursive comment renderer
  const renderCommentItem = (comment: ProductCommentDTO) => {
    const isAuthor = user && user.id === comment.author.id;
    const canReply = comment.depth < 2; // max depth 2

    return (
      <div key={comment.id} className="py-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#faf9f8] border border-[#ded9d5] shrink-0">
              {comment.author.avatarUrl ? (
                <Image
                  src={comment.author.avatarUrl}
                  alt={comment.author.displayName}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-[12px]">
                  {comment.author.displayName.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-foreground">
                {comment.author.displayName}
              </span>
              {comment.author.isMaker && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-bold bg-[#f4ddf0] text-primary border border-[#f0cbe8]">
                  <Sparkles size={10} />
                  Maker
                </span>
              )}
              <span className="text-[#ded9d5]">·</span>
              <span className="text-[12px] text-muted-foreground" suppressHydrationWarning>
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {isAuthor && (
            <button
              type="button"
              onClick={() => handleDelete(comment.id)}
              className="text-muted-foreground hover:text-red-600 transition-colors cursor-pointer p-1"
              title="Delete comment"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        {/* Comment Body */}
        <p className="text-[14.5px] leading-relaxed text-primary-text pl-11">
          {comment.body}
        </p>

        {/* Reply Trigger */}
        <div className="pl-11 flex items-center gap-4 text-[12.5px]">
          {canReply && (
            <button
              type="button"
              onClick={() => {
                setReplyingToId(replyingToId === comment.id ? null : comment.id);
                setReplyText('');
              }}
              className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline cursor-pointer"
            >
              <Reply size={13} />
              <span>{replyingToId === comment.id ? 'Cancel reply' : 'Reply'}</span>
            </button>
          )}
        </div>

        {/* Inline Reply Form */}
        {replyingToId === comment.id && (
          <div className="pl-11 pt-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.author.displayName}...`}
                className="flex-1 px-3 py-2 rounded-lg border border-[#ded9d5] bg-white text-[13.5px] text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => handlePostReply(comment.id)}
                disabled={isSubmitting || !replyText.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-primary text-white text-[13px] font-bold hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                <span>Reply</span>
              </button>
            </div>
          </div>
        )}

        {/* Nested Child Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="pl-6 sm:pl-11 mt-3 border-l-2 border-[#f0ece9] space-y-2">
            {comment.replies.map(renderCommentItem)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full space-y-8">
      {/* Discussion Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e8e4e1]">
        <div>
          <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
            Community Discussion
          </span>
          <h2 className="mt-1 text-[24px] sm:text-[28px] font-bold text-foreground tracking-tight">
            Ask the Makers &amp; Discuss
          </h2>
        </div>
      </div>

      {/* Main Comment Input Box (Product Hunt Style) */}
      <div className="bg-[#faf9f8] p-4 sm:p-5 rounded-xl border border-[#ded9d5]">
        {user ? (
          <form onSubmit={handlePostComment} className="space-y-3">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="What do you think? Ask about clinical integrations, hardware, or roadmap..."
              className="w-full p-3.5 rounded-xl border border-[#ded9d5] bg-white text-[14.5px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/70"
            />
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">
                Keep comments respectful and clinically constructive.
              </span>
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary hover:bg-primary-hover text-white text-[13.5px] font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                <span>Post Comment</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 space-y-2">
            <p className="text-[14.5px] text-primary-text">
              Log in to join the conversation and ask questions directly to the product team.
            </p>
            <Link
              href={`/auth/login?redirect=${encodeURIComponent(pathname || '')}`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded bg-primary text-white text-[13.5px] font-bold hover:bg-primary-hover transition-colors"
            >
              Log in to participate
            </Link>
          </div>
        )}
      </div>

      {/* Comments List (Open, Unboxed with Dividers) */}
      <div className="divide-y divide-[#e8e4e1]">
        {commentsList.length > 0 ? (
          commentsList.map(renderCommentItem)
        ) : (
          <div className="py-8 text-center text-muted-foreground text-[14px]">
            No discussion topics started yet. Be the first to ask a question!
          </div>
        )}
      </div>
    </div>
  );
}
