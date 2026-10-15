'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  PlusCircle,
  Image as ImageIcon,
  Send,
  Sparkles,
  X,
  Loader2,
  Tag,
} from 'lucide-react';
import {
  CommunityDetailDTO,
  CommunityPostDTO,
  CommunityPostCategory,
} from '@/types/communities';
import CommunityPostCard from './CommunityPostCard';
import { apiClient } from '@/lib/api';
import { notify } from '@/components/ui/toast';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';

interface CommunityFeedProps {
  community: CommunityDetailDTO;
  initialPosts?: CommunityPostDTO[];
  isMember: boolean;
  composerOpenSignal?: number;
  onLatestPostTimeUpdate?: (time: string) => void;
}

export default function CommunityFeed({
  community,
  initialPosts = [],
  isMember,
  composerOpenSignal,
  onLatestPostTimeUpdate,
}: CommunityFeedProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPostDTO[]>(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  // Adjust state during render when signal changes (avoids setState inside effect)
  const [prevSignal, setPrevSignal] = useState(composerOpenSignal);
  if (composerOpenSignal !== prevSignal) {
    setPrevSignal(composerOpenSignal);
    if (composerOpenSignal && composerOpenSignal > 0) {
      setIsComposerOpen(true);
    }
  }

  // Scroll effect (DOM mutation only, zero setState calls)
  useEffect(() => {
    if (composerOpenSignal && composerOpenSignal > 0) {
      const composerElement = document.getElementById('community-post-composer');
      if (composerElement) {
        composerElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [composerOpenSignal]);

  // Composer fields
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categoryId, setCategoryId] = useState<string>(
    community.categories?.[0]?.id || ''
  );
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Fetch posts when category filter changes
  useEffect(() => {
    let isMounted = true;
    const fetchCategoryPosts = async () => {
      setIsLoadingPosts(true);
      try {
        const query = selectedCategory ? `?categoryId=${selectedCategory}` : '';
        const res = await apiClient<CommunityPostDTO[]>(`/communities/${community.id}/posts${query}`);
        if (isMounted && res.success && res.data) {
          setPosts(res.data);
          if (res.data.length > 0 && onLatestPostTimeUpdate) {
            onLatestPostTimeUpdate(res.data[0].createdAt);
          }
        }
      } catch (err) {
        console.warn('Error fetching community posts:', err);
      } finally {
        if (isMounted) setIsLoadingPosts(false);
      }
    };

    fetchCategoryPosts();
    return () => {
      isMounted = false;
    };
  }, [community.id, selectedCategory, onLatestPostTimeUpdate]);

  // Image upload simulation / Cloudinary integration
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      notify.error('Image must be smaller than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'pentasent_communities');

      // Attempt upload to Cloudinary endpoint or local preview
      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'pentasent'}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (cloudRes.ok) {
        const data = await cloudRes.json();
        setUploadedImageUrl(data.secure_url);
        notify.success('Image uploaded');
      } else {
        // Fallback to object URL for seamless testing
        const objectUrl = URL.createObjectURL(file);
        setUploadedImageUrl(objectUrl);
        notify.success('Visual attached');
      }
    } catch {
      const objectUrl = URL.createObjectURL(file);
      setUploadedImageUrl(objectUrl);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Submit new post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) {
      notify.error('Post body cannot be empty');
      return;
    }

    setIsPublishing(true);
    try {
      const payload = {
        title: title.trim() || null,
        body: body.trim(),
        categoryId: categoryId || null,
        postType: 'standard',
        media: uploadedImageUrl
          ? [{ cloudinaryUrl: uploadedImageUrl, mediaType: 'image' }]
          : [],
      };

      const res = await apiClient<CommunityPostDTO>(`/communities/${community.id}/posts`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success && res.data) {
        setPosts((prev) => [res.data!, ...prev]);
        setTitle('');
        setBody('');
        setUploadedImageUrl(null);
        setIsComposerOpen(false);
        notify.success('Discussion published to community feed');
      } else {
        notify.error(res.error?.message || 'Failed to publish post');
      }
    } catch {
      notify.error('Error connecting to server to publish post');
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePostDeleted = (deletedId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  };

  return (
    <div className="space-y-0 sm:space-y-6">
      {/* Category Filter Pills (Edge-to-edge on mobile with clean divider) */}
      {community.categories && community.categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5 px-4 sm:px-0 sm:py-0 border-b border-[#ded5cd] sm:border-b-0 bg-white sm:bg-transparent">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === null
                ? 'bg-primary text-white'
                : 'bg-[#faf8f6] text-primary-text hover:text-foreground border border-[#ded9d5]'
            }`}
          >
            All Discussions
          </button>

          {community.categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white'
                    : 'bg-[#faf8f6] text-primary-text hover:text-foreground border border-[#ded9d5]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Post Composer Toggle / Form */}
      {isMember ? (
        <div id="community-post-composer" className="rounded-none sm:rounded-xl border-x-0 border-t-0 sm:border border-b border-[#ded5cd] bg-white px-4 py-3.5 sm:p-5 transition-all">
          {!isComposerOpen ? (
            <div
              onClick={() => setIsComposerOpen(true)}
              className="flex items-center gap-3.5 cursor-pointer py-1"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="flex-1 px-4 py-2.5 rounded-lg bg-[#faf8f6] border border-[#f0ece9] text-[13px] md:text-[14px] text-primary-text/80 hover:bg-[#f6f2ee] transition-colors">
                Start a clinical discussion, ask a question, or share a protocol...
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreatePost} className="space-y-4 pt-1">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0ece9]">
                <span className="text-[14px] font-bold text-foreground">
                  New Community Discussion
                </span>
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="p-1 text-primary-text hover:text-foreground cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Title Input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Discussion topic or clinical headline (optional)"
                className="w-full px-4 py-2.5 text-[14px] md:text-[15px] font-medium rounded-lg border border-[#ded9d5] bg-[#faf8f6] text-foreground placeholder:text-primary-text/70 outline-none focus:border-primary focus:bg-white"
              />

              {/* Body Textarea */}
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                required
                placeholder="Share clinical observations, landmark study references, case insights, or question details..."
                className="w-full px-3.5 py-2.5 text-[13px] md:text-[14px] rounded-lg border border-[#ded9d5] bg-[#faf8f6] text-foreground placeholder:text-primary-text/70 outline-none focus:border-primary focus:bg-white resize-y"
              />

              {/* Category Select + Attach Media Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <label htmlFor="post-category-select" className="text-[12px] font-semibold text-primary-text flex items-center gap-1">
                    <Tag size={13} />
                    <span>Category:</span>
                  </label>
                  <select
                    id="post-category-select"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="px-2.5 py-1 text-[12.5px] rounded-md border border-[#ded9d5] bg-[#faf8f6] text-foreground outline-none cursor-pointer"
                  >
                    {community.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2.5">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#ded9d5] bg-[#faf8f6] hover:bg-[#f6f2ee] text-[12.5px] font-semibold text-primary-text transition-colors cursor-pointer">
                    <ImageIcon size={14} className="text-primary" />
                    <span>{isUploadingImage ? 'Attaching...' : 'Attach Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={isPublishing || !body.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-[13px] font-semibold transition-all cursor-pointer"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Publish</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Image Preview if uploaded */}
              {uploadedImageUrl && (
                <div className="relative w-28 h-20 rounded-md overflow-hidden border border-[#ded9d5] mt-2">
                  <Image
                    fill
                    src={uploadedImageUrl}
                    alt="Attached preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setUploadedImageUrl(null)}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-black"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-none sm:rounded-xl border-x-0 border-t-0 sm:border border-b border-[#ded5cd] bg-white text-center">
          <p className="text-[13px] md:text-[14px] lg:text-[15px] text-primary-text">
            Join <strong>{community.name}</strong> to create discussion threads and exchange peer review notes.
          </p>
        </div>
      )}

      {/* Posts List in Clean Divider Stream */}
      <div className="space-y-0 sm:space-y-4">
        {isLoadingPosts ? (
          <>
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="rounded-none sm:rounded-xl border-x-0 border-t-0 sm:border border-b border-[#ded5cd] bg-white px-4 py-4 sm:p-5 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#faf8f6] animate-shimmer shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-36 rounded bg-[#faf8f6] animate-shimmer" />
                    <div className="h-3 w-24 rounded bg-[#faf8f6] animate-shimmer" />
                  </div>
                </div>
                <div className="h-5 w-3/4 rounded bg-[#faf8f6] animate-shimmer" />
                <div className="space-y-2">
                  <div className="h-3.5 w-full rounded bg-[#faf8f6] animate-shimmer" />
                  <div className="h-3.5 w-5/6 rounded bg-[#faf8f6] animate-shimmer" />
                  <div className="h-3.5 w-2/3 rounded bg-[#faf8f6] animate-shimmer" />
                </div>
                <div className="pt-2 flex items-center gap-4 border-t border-[#f0ece9]">
                  <div className="h-4 w-20 rounded bg-[#faf8f6] animate-shimmer" />
                  <div className="h-4 w-20 rounded bg-[#faf8f6] animate-shimmer" />
                </div>
              </div>
            ))}
          </>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              isMember={isMember}
              onPostDeleted={handlePostDeleted}
            />
          ))
        ) : (
          <div className="py-12 text-center rounded-none sm:rounded-xl border-x-0 border-t-0 sm:border border-b border-[#ded5cd] bg-white p-6 sm:p-12">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <MessageSquare size={20} />
            </div>
            <h4 className="text-[17px] font-bold text-foreground">
              No Discussions Yet in this Category
            </h4>
            <p className="mt-1.5 text-[13px] md:text-[14px] lg:text-[15px] text-primary-text max-w-sm mx-auto leading-relaxed">
              Start the first conversation or check another category filter above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
