'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Post, Comment, Community, Channel } from '@/types/database';
import { PostCard } from '@/components/feed/PostCard';
import { CreatePostCard } from '@/components/feed/CreatePostCard';
import { EditPostDialog } from '@/components/feed/EditPostDialog';
import { PostDetailPanel } from '@/components/feed/PostDetailPanel';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FeedPage() {
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const postIdFromUrl = searchParams.get('post');

    // Detail Panel View State
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [selectedCommunityFilter, setSelectedCommunityFilter] = useState<string | null>(null);

    const [showFloatingCreate, setShowFloatingCreate] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);


    // Fetch Global Data (Communities, Channels)
    const { data: globalData, isLoading: loadingGlobal } = useQuery({
        queryKey: ['feedGlobal', user?.id],
        enabled: !authLoading && !!user,
        queryFn: async () => {
            let comms: Community[] = [];
            if (user) {
                const { data: memberData } = await supabase.from('community_followers').select('community_id').eq('user_id', user.id);
                if (memberData && memberData.length > 0) {
                    const joinedIds = memberData.map(m => m.community_id);
                    const { data: commData } = await supabase.from('communities').select('*').eq('is_active', true).in('id', joinedIds);
                    if (commData) comms = commData;
                }
            }
            const { data: chanData } = await supabase.from('channels').select('*').eq('is_active', true);
            return {
                communities: comms,
                channels: chanData || []
            };
        },
        staleTime: 1000 * 60 * 10,
        placeholderData: keepPreviousData
    });

    const communities = globalData?.communities || [];
    const channels = globalData?.channels || [];

    // Fetch Posts Data
    const { data: postsData, isLoading: loadingPosts } = useQuery({
        queryKey: ['feedPosts', user?.id, selectedCommunityFilter],
        enabled: !authLoading && !!user,
        queryFn: async () => {
            let postsQuery = supabase
                .from('posts')
                .select(`
                    *,
                    user:users(id, name, avatar_url),
                    community:communities(id, name, logo_url),
                    images:post_images(*),
                    channels:channels(id, name)
                `)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(20);

            if (selectedCommunityFilter) {
                postsQuery = postsQuery.eq('community_id', selectedCommunityFilter);
            }

            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), 10000));
            const postsResult = await Promise.race([postsQuery, timeoutPromise]) as any;

            if (postsResult.error) {
                console.error("Posts Error:", postsResult.error);
                throw postsResult.error;
            }

            let formattedPosts = postsResult.data as any[];

            if (user && formattedPosts.length > 0) {
                const postIds = formattedPosts.map(p => p.id);
                const { data: likesData } = await supabase
                    .from('likes')
                    .select('post_id')
                    .eq('user_id', user.id)
                    .in('post_id', postIds);

                const likedSet = new Set(likesData?.map(l => l.post_id) || []);
                formattedPosts = formattedPosts.map(p => ({
                    ...p,
                    user_has_liked: likedSet.has(p.id)
                }));
            }

            return formattedPosts as Post[];
        },
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData
    });

    const posts = React.useMemo(() => postsData || [], [postsData]);
    const loading = loadingPosts || loadingGlobal;

    // Fetch Comments Data
    const { data: commentsData, isLoading: loadingCommentsQuery } = useQuery({
        queryKey: ['postComments', selectedPost?.id, user?.id],
        enabled: !!selectedPost,
        queryFn: async () => {
            if (!selectedPost) return [];

            const fetchCommentsPromise = supabase
                .from('comments')
                .select(`
                    *,
                    user:users(id, name, avatar_url),
                    replies:comments(*, user:users(id, name, avatar_url))
                `)
                .eq('post_id', selectedPost.id)
                .is('parent_comment_id', null)
                .order('created_at', { ascending: true });

            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), 10000));
            const commentsResult = await Promise.race([fetchCommentsPromise, timeoutPromise]) as any;

            if (commentsResult.error) throw commentsResult.error;

            let formattedComments = (commentsResult.data || []) as any[];

            if (user && formattedComments.length > 0) {
                const allCommentIds: string[] = [];
                formattedComments.forEach((c: any) => {
                    allCommentIds.push(c.id);
                    if (c.replies) c.replies.forEach((r: any) => allCommentIds.push(r.id));
                });
                const { data: clData } = await supabase.from('comment_likes').select('comment_id').eq('user_id', user.id).in('comment_id', allCommentIds);
                const likedSet = new Set(clData?.map(l => l.comment_id) || []);

                formattedComments = formattedComments.map(c => ({
                    ...c, user_has_liked: likedSet.has(c.id),
                    replies: c.replies.map((r: any) => ({ ...r, user_has_liked: likedSet.has(r.id) }))
                }));
            }
            return formattedComments as Comment[];
        },
        // staleTime: 1000 * 60 * 5,
        // placeholderData: (prev) => prev
    });

    const postComments = commentsData || [];
    const loadingComments = loadingCommentsQuery;

    // 2. Setup real-time listeners exactly ONCE on mount
    useEffect(() => {
        // Only run this ONCE on mount because of empty dependency array []
        const channel = supabase.channel('feed-updates')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'posts' },
                () => {
                    queryClient.invalidateQueries({
                        queryKey: ['feedPosts', user?.id, selectedCommunityFilter]
                    });
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Successfully subscribed to real-time feed updates.');
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient, selectedCommunityFilter, user?.id]); // Empty dependency array means we never tear down and rebuild the socket un-necessarily



    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowFloatingCreate(true);
            } else {
                setShowFloatingCreate(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    useEffect(() => {
        if (!postIdFromUrl || !user) return; // wait for user

        let isMounted = true;

        const loadSharedPost = async () => {
            // 1. check cache
            const cachedPosts = queryClient.getQueryData<Post[]>(['feedPosts', user.id, selectedCommunityFilter]) || [];
            const found = cachedPosts.find(p => p.id === postIdFromUrl);
            if (found) {
                setSelectedPost(found);
                return;
            }

            // 2. Fetch from DB
            const { data } = await supabase
                .from('posts')
                .select(`
                    *,
                    user:users(id, name, avatar_url),
                    community:communities(id, name, logo_url),
                    images:post_images(*),
                    channels:channels(id, name)
                `)
                .eq('id', postIdFromUrl)
                .maybeSingle();

            if (data && isMounted) {
                // Check if user has liked it to be consistent
                const { data: likeData } = await supabase.from('likes').select('id').eq('post_id', data.id).eq('user_id', user.id).maybeSingle();
                setSelectedPost({ ...data, user_has_liked: !!likeData } as Post);
            } else if (!data && isMounted) {
                toast({
                    title: "Post not found",
                    description: "The post may have been removed.",
                    variant: "destructive",
                });
                router.replace('/app/feed', { scroll: false });
            }
        };

        loadSharedPost();

        return () => { isMounted = false; };
    }, [postIdFromUrl, queryClient, user, selectedCommunityFilter, router, toast]);

    const handleCreatePost = async (data: { community_id: string; channel_ids: string[]; title: string; content: string; images: File[] }) => {
        if (!user) return;

        const contentPayload = {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: data.content.trim() }] }]
        };

        const { data: newPostData, error } = await supabase
            .from('posts')
            .insert({
                user_id: user.id,
                community_id: data.community_id,
                title: data.title || null,
                content: contentPayload,
                likes_count: 0,
                comments_count: 0,
                views_count: 0,
                is_active: true
            })
            .select('*').single();

        if (error) throw error;

        let newPost = newPostData as any;

        // Upload images to avatars/posts
        if (data.images && data.images.length > 0) {
            for (let i = 0; i < data.images.length; i++) {
                const file = data.images[i];
                const fileExt = file.name.split('.').pop() || 'jpg';
                const fileName = `posts/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { cacheControl: '3600', upsert: false });
                if (uploadError) {
                    console.error("Image upload error:", uploadError);
                    toast({
                        title: "Upload failed",
                        description: `Failed to upload ${file.name}.`,
                        variant: "destructive",
                    });
                    throw uploadError;
                }
                const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
                await supabase.from('post_images').insert({
                    post_id: newPost.id,
                    image_url: publicUrl,
                    order_index: i
                });
            }
        }

        // Refetch fully hydrated post
        const { data: fullPost } = await supabase.from('posts').select(`
            *,
            user:users(id, name, avatar_url),
            community:communities(id, name, logo_url),
            images:post_images(*),
            channels:channels(id, name)
        `).eq('id', newPost.id).single();

        if (fullPost) {
            queryClient.setQueryData(['feedPosts', user?.id, selectedCommunityFilter], (old: Post[] | undefined) => {
                if (!old) return [fullPost as any];
                return [fullPost as any, ...old];
            });
        }
    };

    const handleEditPostSubmit = async (title: string, content: string, imagesToRemove: string[], newImages: File[]) => {
        if (!user || !selectedPost) return;

        const contentPayload = {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: content.trim() }] }]
        };

        const { error } = await supabase
            .from('posts')
            .update({
                title: title || null,
                content: contentPayload
            })
            .eq('id', selectedPost.id);

        if (error) throw error;

        // Handle Image Deletions
        if (imagesToRemove.length > 0) {
            const imagesToDeleteDb = selectedPost.images?.filter((img: any) => imagesToRemove.includes(img.id)) || [];
            const filePaths = imagesToDeleteDb.map((img: any) => {
                const urlObj = new URL(img.image_url);
                const pathSegments = urlObj.pathname.split('/');
                const fileName = pathSegments.pop();
                return `posts/${fileName}`;
            });

            if (filePaths.length > 0) {
                await supabase.storage.from('avatars').remove(filePaths);
                await supabase.from('post_images').delete().in('id', imagesToRemove);
            }
        }

        // Handle New Image Uploads
        if (newImages.length > 0) {
            // Get highest current order_index
            const currentMaxOrder = selectedPost.images?.length
                ? Math.max(...selectedPost.images.map((img: any) => img.order_index || 0))
                : -1;

            for (let i = 0; i < newImages.length; i++) {
                const file = newImages[i];
                const fileExt = file.name.split('.').pop() || 'jpg';
                const fileName = `posts/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { cacheControl: '3600', upsert: false });
                if (uploadError) {
                    console.error("Image upload error:", uploadError);
                    toast({
                        title: "Upload failed",
                        description: `Failed to upload ${file.name}.`,
                        variant: "destructive",
                    });
                    throw uploadError;
                }
                const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
                await supabase.from('post_images').insert({
                    post_id: selectedPost.id,
                    image_url: publicUrl,
                    order_index: currentMaxOrder + 1 + i
                });
            }
        }

        // Refetch fully hydrated post to get accurate updated images
        const { data: fullPost } = await supabase.from('posts').select(`
            *,
            user:users(id, name, avatar_url),
            community:communities(id, name, logo_url),
            images:post_images(*),
            channels:channels(id, name)
        `).eq('id', selectedPost.id).single();

        if (fullPost) {
            setSelectedPost(fullPost as any);
            queryClient.setQueryData(['feedPosts', user?.id, selectedCommunityFilter], (old: Post[] | undefined) => {
                if (!old) return old;
                return old.map(p => p.id === selectedPost.id ? (fullPost as any) : p);
            });
        }
    };

    const handleLikePost = async (postToLike: Post) => {
        if (!user) {
            toast({
                title: "Login required",
                description: "Please log in to like a post.",
                variant: "destructive",
            });
            return;
        }

        const isLiked = postToLike.user_has_liked;
        const newCount = isLiked ? Math.max(0, postToLike.likes_count - 1) : postToLike.likes_count + 1;

        // Optimistic UI update
        const updateState = (p: Post) => p.id === postToLike.id ? { ...p, likes_count: newCount, user_has_liked: !isLiked } : p;
        queryClient.setQueryData(['feedPosts', user?.id, selectedCommunityFilter], (old: Post[] | undefined) => {
            if (!old) return old;
            return old.map(updateState);
        });

        if (selectedPost?.id === postToLike.id) {
            setSelectedPost(updateState(selectedPost));
        }

        try {
            if (isLiked) {
                await supabase.from('likes').delete().eq('post_id', postToLike.id).eq('user_id', user.id);
                await supabase.from('posts').update({ likes_count: newCount }).eq('id', postToLike.id);
            } else {
                await supabase.from('likes').insert({ post_id: postToLike.id, user_id: user.id });
                await supabase.from('posts').update({ likes_count: newCount }).eq('id', postToLike.id);
            }
        } catch (e) {
            console.error("Failed to toggle like", e);
        }
    };
    const openPostDetails = (post: Post) => {
        if (selectedPost?.id === post.id) return;

        const newViewCount = (post.views_count || 0) + 1;
        const updatedPostInfo = { ...post, views_count: newViewCount };

        // Update feed cache first
        queryClient.setQueryData(
            ['feedPosts', user?.id, selectedCommunityFilter],
            (old: Post[] | undefined) => {
                if (!old) return old;
                return old.map(p => (p.id === post.id ? updatedPostInfo : p));
            }
        );

        // Update selected post
        setSelectedPost(updatedPostInfo);

        router.replace(`/app/feed?post=${post.id}`, { scroll: false });
        // Fire-and-forget DB update
        supabase
            .from('posts')
            .update({ views_count: newViewCount })
            .eq('id', post.id)
            .then()
    };

    const handleSubmitComment = async (content: string, replyToId?: string) => {
        if (!user || !selectedPost) return;

        const contentPayload = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: content.trim() }] }] };

        const { data: commentData, error } = await supabase
            .from('comments')
            .insert({ post_id: selectedPost.id, user_id: user.id, content: contentPayload, parent_comment_id: replyToId || null })
            .select(`*, user:users(id, name, avatar_url)`).single();

        if (error) throw error;

        // Optimistic UI updates
        const newCommentCount = (selectedPost.comments_count || 0) + 1;
        await supabase.from('posts').update({ comments_count: newCommentCount }).eq('id', selectedPost.id);

        queryClient.setQueryData(['feedPosts', user?.id, selectedCommunityFilter], (old: Post[] | undefined) => {
            if (!old) return old;
            return old.map(p => p.id === selectedPost.id ? { ...p, comments_count: newCommentCount } : p);
        });
        setSelectedPost(prev => prev ? { ...prev, comments_count: newCommentCount } : null);

        if (replyToId) {
            queryClient.setQueryData(['postComments', selectedPost.id, user?.id], (old: Comment[] | undefined) => {
                if (!old) return old;
                return old.map(c => c.id === replyToId ? { ...c, replies: [...(c.replies || []), commentData as any] } : c);
            });
        } else {
            queryClient.setQueryData(['postComments', selectedPost.id, user?.id], (old: Comment[] | undefined) => {
                if (!old) return [commentData as any];
                return [...old, commentData as any];
            });
            // Scroll to newly added comment using setTimeout queue to wait for DOM paint
            setTimeout(() => {
                const commentEl = document.getElementById(`comment-${commentData.id}`);
                if (commentEl) commentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    };

    const handleLikeComment = async (commentId: string) => {
        if (!user) return;

        // Optimistic
        const updateComments = (list: Comment[]): Comment[] => list.map(c => {
            if (c.id === commentId) return { ...c, likes_count: c.user_has_liked ? Math.max(0, c.likes_count - 1) : c.likes_count + 1, user_has_liked: !c.user_has_liked };
            if (c.replies) return { ...c, replies: updateComments(c.replies) };
            return c;
        });
        queryClient.setQueryData(['postComments', selectedPost?.id, user?.id], (old: Comment[] | undefined) => {
            if (!old) return old;
            return updateComments(old);
        });

        // Sync
        const { data: existing } = await supabase.from('comment_likes').select('id').eq('comment_id', commentId).eq('user_id', user.id).maybeSingle();
        if (existing) {
            await supabase.from('comment_likes').delete().eq('id', existing.id);
        } else {
            await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: user.id });
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        const { error } = await supabase.from('comments').delete().eq('id', commentId);
        if (error) {
            toast({
                title: "Error",
                description: "Failed to delete comment",
                variant: "destructive",
            });
            return;
        }

        const filterComments = (list: Comment[]): Comment[] => list.filter(c => c.id !== commentId).map(c => ({ ...c, replies: c.replies ? filterComments(c.replies) : [] }));
        queryClient.setQueryData(['postComments', selectedPost?.id, user?.id], (old: Comment[] | undefined) => {
            if (!old) return old;
            return filterComments(old);
        });

        const newCount = Math.max(0, (selectedPost?.comments_count || 0) - 1);
        queryClient.setQueryData(['feedPosts', user?.id, selectedCommunityFilter], (old: Post[] | undefined) => {
            if (!old) return old;
            return old.map(p => p.id === selectedPost?.id ? { ...p, comments_count: newCount } : p);
        });
        setSelectedPost(prev => prev ? { ...prev, comments_count: newCount } : null);
        toast({
            title: "Comment deleted",
        });
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFFBF7]">
                <Loader2 className="w-8 h-8 animate-spin text-[#3d2f4d] mb-4" />
            </div>
        );
    }

    if (!user) return null;

    const handleDeletePost = async () => {
        if (!selectedPost) return;
        await supabase.from('posts').delete().eq('id', selectedPost.id);
        queryClient.setQueryData(['feedPosts', user?.id, selectedCommunityFilter], (old: Post[] | undefined) => {
            if (!old) return old;
            return old.filter(p => p.id !== selectedPost.id);
        });
        setSelectedPost(null);
        toast({
            title: "Post deleted",
        });
    };

    // const handleSharePost = async (post: Post) => {
    //     const url = `${window.location.origin}/app/feed?post=${post.id}`;

    //     if (navigator.share) {
    //         try {
    //             await navigator.share({
    //                 title: post.title || 'Pentasent Post',
    //                 url: url
    //             });
    //         } catch (err) {
    //             console.error("Share failed:", err);
    //         }
    //     } else {
    //         try {
    //             await navigator.clipboard.writeText(url);
    //             toast.success("Link copied to clipboard!");
    //         } catch (err) {
    //             toast.error("Failed to copy link.");
    //         }
    //     }
    // };

    const handleSharePost = async (post: Post) => {
        const url = `${window.location.origin}/app/feed?post=${post.id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title || 'Pentasent Post',
                    url
                });
                return;
            } catch (err) {
                console.error("Share failed:", err);
            }
        }

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
            } else {
                // fallback for mobile browsers
                const textArea = document.createElement("textarea");
                textArea.value = url;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                document.body.appendChild(textArea);

                textArea.focus();
                textArea.select();

                document.execCommand("copy");
                textArea.remove();
            }

            toast({
                title: "Link copied!",
            });
        } catch (err) {
            toast({
                title: "Copy failed",
                description: "Unable to copy link.",
                variant: "destructive",
            });
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen pb-20">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-12 gap-8 items-start max-w-[1400px] mx-auto lg:px-8">

                {/* LEFT FEED */}
                <div className="max-w-[700px] mx-auto xl:mx-0 w-full flex flex-col mt-24 xl:mt-8">
                    {/* Community Filters (Moved ABOVE Create Post) */}
                    {communities.length > 0 && (
                        <div className="px-4 md:px-0 mb-6 w-full">
                            <div className="flex items-center gap-3 overflow-x-auto pb-4 custom-scrollbar px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15px, black calc(100% - 30px), transparent)', maskImage: 'linear-gradient(to right, transparent, black 15px, black calc(100% - 30px), transparent)' }}>
                                <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                                <button
                                    onClick={() => setSelectedCommunityFilter(null)}
                                    className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-transform hover:scale-105 active:scale-95 shadow-md ${selectedCommunityFilter === null ? 'bg-[#3c2a34] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    All Communities
                                </button>
                                {communities.map(comm => (
                                    <button
                                        key={comm.id}
                                        onClick={() => setSelectedCommunityFilter(comm.id)}
                                        className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-transform hover:scale-105 active:scale-95 shadow-sm ${selectedCommunityFilter === comm.id ? 'bg-[#3c2a34] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {comm.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="px-4 md:px-0 mb-6">
                        <CreatePostCard
                            communities={communities}
                            channels={channels}
                            onSubmit={handleCreatePost}
                            userAvatar={user?.avatar_url || 'https://via.placeholder.com/40'}
                        />
                    </div>

                    {loading && posts.length === 0 && !postIdFromUrl ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
                            <p className="text-gray-500 font-medium">Loading feed...</p>
                        </div>
                    ) : (
                        <div className="space-y-0 px-4 md:px-0">
                            {posts.length === 0 ? (
                                <div className="text-center py-20 bg-white/50 rounded-2xl border border-gray-100 border-dashed">
                                    <p className="text-gray-500 font-medium">No posts in your feed yet.</p>
                                </div>
                            ) : (
                                posts.map((post) => (
                                    <div className="mb-6" key={post.id}>
                                        <PostCard
                                            post={post}
                                            onPress={() => openPostDetails(post)}
                                            onLike={(e) => { e.stopPropagation(); handleLikePost(post); }}
                                            onComment={(e) => { e.stopPropagation(); openPostDetails(post); }}
                                            onShare={(e) => { e.stopPropagation(); handleSharePost(post); }}
                                        />
                                    </div>
                                ))
                            )}

                            {!loading && posts.length > 0 && (
                                <div className="text-center py-10 pt-4">
                                    <p className="text-gray-400 font-medium text-sm">You&apos;ve reached the end of the feed.</p>
                                    <p className="text-gray-400 text-xs mt-1 italic">Try refreshing to see new content.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT SIDEBAR (Desktop Post Detail Overlay) */}
                <div className="hidden xl:block relative h-full mt-8">
                    <div className="sticky top-8 h-[calc(100vh-4rem)] w-full">
                        <AnimatePresence mode="wait">
                            {selectedPost ? (
                                <motion.div
                                    key={selectedPost.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-[calc(100vh-4rem)] w-full shadow-2xl rounded-2xl bg-white border border-gray-200 overflow-hidden"
                                >
                                    <PostDetailPanel
                                        post={selectedPost}
                                        comments={postComments}
                                        loadingComments={loadingComments}
                                        currentUserId={user?.id}
                                        onClose={() => {
                                            setSelectedPost(null);
                                            router.replace('/app/feed', { scroll: false });
                                        }}
                                        onLikePost={() => handleLikePost(selectedPost)}
                                        onSharePost={() => handleSharePost(selectedPost)}
                                        onDeletePost={handleDeletePost}
                                        onEditPost={() => setShowEditDialog(true)}
                                        onSubmitComment={handleSubmitComment}
                                        onLikeComment={handleLikeComment}
                                        onDeleteComment={handleDeleteComment}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-gray-50/50"
                                >
                                    <MessageCircle className="w-12 h-12 text-gray-300 mb-4" />
                                    <h3 className="text-gray-900 font-semibold mb-2">Select a Post</h3>
                                    <p className="text-gray-500 text-sm">Click any post from your feed to view details, read comments, and join the discussion.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* FULLSCREEN OVERLAY (Mobile Post Detail) */}
            <AnimatePresence>
                {selectedPost && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                        className="fixed inset-0 z-50 xl:hidden bg-white"
                    >
                        <PostDetailPanel
                            post={selectedPost}
                            comments={postComments}
                            loadingComments={loadingComments}
                            currentUserId={user?.id}
                            onClose={() => {
                                setSelectedPost(null);
                                router.replace('/app/feed', { scroll: false });
                            }}
                            onLikePost={() => handleLikePost(selectedPost)}
                            onSharePost={() => handleSharePost(selectedPost)}
                            onDeletePost={handleDeletePost}
                            onEditPost={() => setShowEditDialog(true)}
                            onSubmitComment={handleSubmitComment}
                            onLikeComment={handleLikeComment}
                            onDeleteComment={handleDeleteComment}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Create Post */}
            <AnimatePresence>
                {showFloatingCreate && (
                    <div className="fixed lg:pl-[80px] bottom-0 left-0 w-full z-40 flex justify-center pb-0 pointer-events-none" style={{ bottom: 'env(safe-area-inset-bottom, 0)' }}>
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-[1400px] mx-auto lg:px-16 px-0 pointer-events-none"
                        >
                            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-12 gap-8 md:px-0">
                                <div className="max-w-[700px] mx-auto xl:mx-0 w-full px-2 lg:px-0 z-40 bg-white border-t border-gray-200 lg:border shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] lg:rounded-t-3xl md:rounded-t-3xl pointer-events-auto">
                                    <CreatePostCard
                                        communities={communities}
                                        channels={channels}
                                        onSubmit={handleCreatePost}
                                        userAvatar={user?.avatar_url || 'https://via.placeholder.com/40'}
                                        minimal={true}
                                    />
                                </div>
                                <div className="hidden xl:block" />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {selectedPost && (
                <EditPostDialog
                    isOpen={showEditDialog}
                    onClose={() => setShowEditDialog(false)}
                    post={selectedPost}
                    communities={communities}
                    channels={channels}
                    onSubmit={handleEditPostSubmit}
                />
            )}
        </div>
    );
}
