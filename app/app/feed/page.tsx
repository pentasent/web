'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Post, Comment, Community, Channel } from '@/types/database';
import { PostCard } from '@/components/feed/PostCard';
import { CreatePostCard } from '@/components/feed/CreatePostCard';
import { EditPostDialog } from '@/components/feed/EditPostDialog';
import { PostDetailPanel } from '@/components/feed/PostDetailPanel';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MessageCircle, ChevronDown, Filter, Info } from 'lucide-react';
import { compressImage } from '@/lib/image-upload';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { GlobalLayout } from '@/components/layout/global-layout';
import Image from 'next/image';
import { SmartImage } from '@/components/ui/SmartImage';

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
    const { data: postsData, isLoading: loadingPosts, isError: isErrorPosts, error: errorPosts } = useQuery({
        queryKey: ['feedPosts', user?.id, selectedCommunityFilter],
        enabled: !authLoading && !!user,
        queryFn: async () => {
            let postsQuery = supabase
                .from('posts')
                .select(`
                    *,
                    user:users(id, name, avatar_url),
                    community:communities(id, name, logo_url),
                    images:post_images(*)
                `)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(20);

            if (selectedCommunityFilter) {
                postsQuery = postsQuery.eq('community_id', selectedCommunityFilter);
            }

            const { data, error } = await postsQuery;

            if (error) {
                console.error("Posts Error:", error);
                throw error;
            }

            let formattedPosts = data as any[];

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
    const isError = isErrorPosts;
    const errorMessage = errorPosts instanceof Error ? errorPosts.message : 'Failed to load posts';

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
            // Removing channels join as it might be causing query failure due to schema mismatch/junction table issues
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    user:users(id, name, avatar_url),
                    community:communities(id, name, logo_url),
                    images:post_images(*)
                `)
                .eq('id', postIdFromUrl)
                .maybeSingle();

            if (error) {
                console.error("Shared post fetch error:", error);
            }

            if (data && isMounted) {
                // Check if user has liked it to be consistent
                const { data: likeData } = await supabase.from('likes').select('id').eq('post_id', data.id).eq('user_id', user.id).maybeSingle();
                setSelectedPost({ ...data, user_has_liked: !!likeData } as Post);
            } else if (!data && isMounted) {
                toast({
                    title: "Post not found",
                    description: "The post may have been removed or you don't have access.",
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

        const tempId = `temp-${Date.now()}`;
        const localImageUrls = data.images.map(file => URL.createObjectURL(file));

        const contentPayload = {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: data.content.trim() }] }]
        };

        // Optimistic UI update
        const tempPost: Post = {
            id: tempId,
            user_id: user.id,
            community_id: data.community_id,
            title: data.title || null,
            content: contentPayload,
            likes_count: 0,
            comments_count: 0,
            views_count: 0,
            is_active: true,
            created_at: new Date().toISOString(),
            user: { id: user.id, name: user.name || 'Anonymous', avatar_url: user.avatar_url || null } as any,
            community: globalData?.communities.find(c => c.id === data.community_id),
            is_uploading: true,
            local_image_urls: localImageUrls,
            is_edited: false
        };

        queryClient.setQueryData(['feedPosts', user?.id, selectedCommunityFilter], (old: Post[] | undefined) => {
            if (!old) return [tempPost];
            return [tempPost, ...old];
        });

        // Background Process
        (async () => {
            try {
                // Compress images in parallel
                const compressedImages = await Promise.all(data.images.map(img => compressImage(img)));

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
                const newPostId = newPostData.id;

                // Parallel uploads and DB inserts
                if (compressedImages.length > 0) {
                    const uploadPromises = compressedImages.map(async (file, i) => {
                        const fileExt = file.name.split('.').pop() || 'jpg';
                        const fileName = `posts/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

                        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { cacheControl: '3600', upsert: false });
                        if (uploadError) throw uploadError;

                        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
                        
                        return {
                            post_id: newPostId,
                            image_url: publicUrl,
                            order_index: i
                        };
                    });

                    const imagesToInsert = await Promise.all(uploadPromises);
                    const { error: imgError } = await supabase.from('post_images').insert(imagesToInsert);
                    if (imgError) throw imgError;
                }

                // Refetch fully hydrated post
                const { data: fullPost } = await supabase.from('posts').select(`
                    *,
                    user:users(id, name, avatar_url),
                    community:communities(id, name, logo_url),
                    images:post_images(*)
                `).eq('id', newPostId).single();

                if (fullPost) {
                    queryClient.setQueryData(['feedPosts', user?.id, selectedCommunityFilter], (old: Post[] | undefined) => {
                        if (!old) return [fullPost as any];
                        // Replace temp post with real post
                        return old.map(p => p.id === tempId ? (fullPost as any) : p);
                    });
                }
            } catch (err) {
                console.error("Background create post error:", err);
                // Remove temp post on failure
                queryClient.setQueryData(['feedPosts', user?.id, selectedCommunityFilter], (old: Post[] | undefined) => {
                    return old?.filter(p => p.id !== tempId);
                });
                toast({
                    title: "Failed to create post",
                    description: "An error occurred while uploading. The post has been removed.",
                    variant: "destructive"
                });
            } finally {
                // Cleanup blob URLs
                localImageUrls.forEach(url => URL.revokeObjectURL(url));
            }
        })();

        return new Promise<void>(resolve => setTimeout(resolve, 2000));
    };

    const handleEditPostSubmit = async (title: string, content: string, imagesToRemove: string[], newImages: File[]) => {
        if (!user || !selectedPost) return;

        // Set updating state
        const originalPost = { ...selectedPost };
        const localPreviews = newImages.map(img => URL.createObjectURL(img));
        
        const updatingPost = { 
            ...selectedPost, 
            is_uploading: true, 
            local_image_urls: [...(selectedPost.images?.map(img => img.image_url) || []), ...localPreviews]
        };
        
        setSelectedPost(updatingPost as any);
        queryClient.setQueryData(['feedPosts', user?.id, selectedCommunityFilter], (old: Post[] | undefined) => {
            return old?.map(p => p.id === selectedPost.id ? (updatingPost as any) : p);
        });

        // Background process
        (async () => {
            try {
                const contentPayload = {
                    type: 'doc',
                    content: [{ type: 'paragraph', content: [{ type: 'text', text: content.trim() }] }]
                };

                const { error: postError } = await supabase
                    .from('posts')
                    .update({
                        title: title || null,
                        content: contentPayload
                    })
                    .eq('id', selectedPost.id);

                if (postError) throw postError;

                // Handle Image Deletions and Uploads in parallel
                const jobs: any[] = [];

                if (imagesToRemove.length > 0) {
                    const imagesToDeleteDb = (selectedPost.images || []).filter((img: any) => imagesToRemove.includes(img.id));
                    const filePaths = imagesToDeleteDb.map((img: any) => {
                        try {
                            const urlObj = new URL(img.image_url);
                            return urlObj.pathname.split('/').slice(-2).join('/'); // 'posts/filename'
                        } catch { return null; }
                    }).filter(Boolean) as string[];

                    if (filePaths.length > 0) {
                        jobs.push(supabase.storage.from('avatars').remove(filePaths));
                        jobs.push(Promise.resolve(supabase.from('post_images').delete().in('id', imagesToRemove)));
                    }
                }

                if (newImages.length > 0) {
                    const compressed = await Promise.all(newImages.map(img => compressImage(img)));
                    const currentMaxOrder = (selectedPost.images || []).reduce((max: number, img: any) => Math.max(max, img.order_index || 0), -1);

                    const uploadJobs = compressed.map(async (file, i) => {
                        const fileExt = file.name.split('.').pop() || 'jpg';
                        const fileName = `posts/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                        const { error } = await supabase.storage.from('avatars').upload(fileName, file);
                        if (error) throw error;
                        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
                        return { post_id: selectedPost.id, image_url: publicUrl, order_index: currentMaxOrder + 1 + i };
                    });
                    
                    jobs.push(Promise.all(uploadJobs).then(imgs => supabase.from('post_images').insert(imgs)));
                }

                await Promise.all(jobs);

                // Refetch
                const { data: fullPost } = await supabase.from('posts').select(`
                    *,
                    user:users(id, name, avatar_url),
                    community:communities(id, name, logo_url),
                    images:post_images(*)
                `).eq('id', selectedPost.id).single();

                if (fullPost) {
                    setSelectedPost(fullPost as any);
                    queryClient.setQueryData(['feedPosts', user?.id, selectedCommunityFilter], (old: Post[] | undefined) => {
                        return old?.map(p => p.id === selectedPost.id ? (fullPost as any) : p);
                    });
                }
                toast({ title: "Post updated successfully" });

            } catch (err) {
                console.error("Background update error:", err);
                setSelectedPost(originalPost);
                queryClient.setQueryData(['feedPosts', user?.id, selectedCommunityFilter], (old: Post[] | undefined) => {
                    return old?.map(p => p.id === selectedPost.id ? originalPost : p);
                });
                toast({ title: "Update failed", description: "Failed to save changes. Reverting to original state.", variant: "destructive" });
            } finally {
                localPreviews.forEach(url => URL.revokeObjectURL(url));
            }
        })();

        return new Promise<void>(resolve => setTimeout(resolve, 2000));
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

    const handleDeletePost = async () => {
        if (!selectedPost) return;

        const postId = selectedPost.id;
        const originalFeedData = queryClient.getQueryData(['feedPosts', user?.id, selectedCommunityFilter]);

        // 1. Optimistic UI update
        queryClient.setQueryData(['feedPosts', user?.id, selectedCommunityFilter], (old: Post[] | undefined) => {
            if (!old) return old;
            return old.filter(p => p.id !== postId);
        });
        setSelectedPost(null);
        router.replace('/app/feed', { scroll: false });

        // 2. Background cleanup process
        (async () => {
            try {
                // 2.1 Get image paths for bucket cleanup
                const images = selectedPost.images || [];
                const filePaths = images.map((img: any) => {
                    try {
                        const urlObj = new URL(img.image_url);
                        return urlObj.pathname.split('/').slice(-2).join('/');
                    } catch { return null; }
                }).filter(Boolean) as string[];

                if (filePaths.length > 0) {
                    supabase.storage.from('avatars').remove(filePaths).then();
                }

                // 2.2 Delete related data from DB
                const { error: relError } = await (async () => {
                    const { error: e1 } = await supabase.from('likes').delete().eq('post_id', postId);
                    if (e1) return { error: e1 };
                    
                    const { data: comments } = await supabase.from('comments').select('id').eq('post_id', postId);
                    if (comments && comments.length > 0) {
                        const commentIds = comments.map(c => c.id);
                        const { error: e2 } = await supabase.from('comment_likes').delete().in('comment_id', commentIds);
                        if (e2) return { error: e2 };
                    }

                    const { error: e3 } = await supabase.from('comments').delete().eq('post_id', postId);
                    if (e3) return { error: e3 };
                    
                    const { error: e4 } = await supabase.from('post_images').delete().eq('post_id', postId);
                    if (e4) return { error: e4 };
                    
                    return { error: null };
                })();

                if (relError) throw relError;

                // 2.3 Finally delete the post itself
                const { error: postDeleteError } = await supabase.from('posts').delete().eq('id', postId);
                if (postDeleteError) throw postDeleteError;

                console.log(`Post ${postId} deleted successfully in background.`);
            } catch (err) {
                console.error("Background delete error:", err);
                // Revert optimistic UI on global error notification
                queryClient.setQueryData(['feedPosts', user?.id, selectedCommunityFilter], originalFeedData);
                toast({
                    title: "Sync Error",
                    description: "Something went wrong while deleting from the server. The post has been restored.",
                    variant: "destructive"
                });
            }
        })();

        // 3. Smooth UI feedback delay
        return new Promise<void>(resolve => {
            setTimeout(() => {
                toast({
                    title: "Post deleted",
                    description: "The post has been removed from your feed."
                });
                resolve();
            }, 2000);
        });
    };

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

    if (authLoading) {
        return (
            <GlobalLayout />
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen pb-20">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-12 gap-8 items-start max-w-[1400px] mx-auto lg:px-8">

                {/* LEFT FEED */}
                <div className="max-w-[700px] mx-auto xl:mx-0 w-full flex flex-col mt-16 lg:mt-4">
                    {/* Compact Header: Create Post + Community Filter */}
                    <div className="px-4 md:px-0 mb-8 z-30 mt-4 lg:mt-0">
                        <CreatePostCard
                            communities={communities}
                            channels={channels}
                            onSubmit={handleCreatePost}
                            userAvatar={user?.avatar_url || 'https://via.placeholder.com/40'}
                            minimal={true}
                            trailing={
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <div className="h-8 w-[1.5px] bg-warm-200/60 mx-1 hidden sm:block" />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-warm-50/50 hover:bg-warm-100/80 transition-all rounded-full text-[13px] sm:text-sm font-bold text-warm-700 border border-transparent whitespace-nowrap active:scale-95">
                                                <Filter size={16} className="text-warm-500 hidden xs:block" />
                                                <span className="max-w-[100px] sm:max-w-[150px] truncate">
                                                    {selectedCommunityFilter
                                                        ? communities.find(c => c.id === selectedCommunityFilter)?.name
                                                        : 'All Communities'}
                                                </span>
                                                <ChevronDown size={14} className="text-warm-400" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="sm:w-[260px] w-full rounded-2xl p-2 bg-white/95 backdrop-blur-xl border-warm-200 shadow-2xl z-[100]">
                                            <div className="px-3 py-2 text-[11px] font-bold text-warm-400 uppercase tracking-wider">Feed Filter</div>
                                            <DropdownMenuItem
                                                onClick={() => setSelectedCommunityFilter(null)}
                                                className={`rounded-xl cursor-pointer py-2.5 px-3 mb-1 transition-colors ${!selectedCommunityFilter ? 'bg-[#3c2a34] text-white font-bold hover:bg-[#3c2a34] hover:text-white' : 'text-warm-600 hover:bg-warm-50'}`}
                                            >
                                                All Communities
                                            </DropdownMenuItem>
                                            <div className="h-px bg-warm-100 my-1 mx-2" />
                                            <div className="max-h-[300px] overflow-y-auto scrollbar-hide snap-x snap-mandatory">
                                                {communities.length > 0 ? (
                                                    communities.map((comm) => (
                                                        <DropdownMenuItem
                                                            key={comm.id}
                                                            onClick={() => setSelectedCommunityFilter(comm.id)}
                                                            className={`rounded-xl cursor-pointer py-2.5 px-3 mb-1 transition-colors ${selectedCommunityFilter === comm.id
                                                                ? 'bg-[#3c2a34] text-white font-bold hover:bg-[#3c2a34] hover:text-white'
                                                                : 'text-warm-600 hover:bg-warm-50'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3 w-full min-w-0">

                                                                {comm.logo_url ? (
                                                                    <Image
                                                                        src={comm.logo_url}
                                                                        alt="Logo"
                                                                        width={24}
                                                                        height={24}
                                                                        className="rounded-full w-6 h-6 shrink-0"
                                                                    />
                                                                    // <div className="w-12 h-12 rounded-full bg-warm-200 overflow-hidden shrink-0 relative">
                                                                    //     <SmartImage
                                                                    //         src={comm.logo_url}
                                                                    //         alt="avatar"
                                                                    //         className="object-cover"
                                                                    //         fallbackIconSize={20}
                                                                    //     />
                                                                    // </div>
                                                                ) : (
                                                                    <div className="w-6 h-6 rounded-full bg-[#3c2a34] shrink-0" />
                                                                )}

                                                                <span className="font-medium text-warm-700 truncate">
                                                                    {comm.name}
                                                                </span>

                                                            </div>
                                                        </DropdownMenuItem>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-8 text-center">
                                                        <Info size={24} className="mx-auto text-warm-200 mb-2" />
                                                        <p className="text-xs text-warm-400">Join communities to see them here</p>
                                                    </div>
                                                )}
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            }
                        />
                    </div>

                    <div className="space-y-0">
                        {loadingPosts && posts.length === 0 ? (
                            <div className="space-y-6 px-4 md:px-0">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-warm-100 border border-warm-200 rounded-[20px] p-5 animate-pulse">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-warm-200" />
                                            <div className="flex-1">
                                                <div className="h-3 w-32 bg-warm-200 rounded mb-2" />
                                                <div className="h-2 w-24 bg-warm-200 rounded" />
                                            </div>
                                        </div>
                                        <div className="h-4 w-2/3 bg-warm-200 rounded mb-3" />
                                        <div className="space-y-2 mb-4">
                                            <div className="h-3 bg-warm-200 rounded" />
                                            <div className="h-3 bg-warm-200 rounded w-5/6" />
                                        </div>
                                        <div className="h-[220px] rounded-xl bg-warm-200 mb-4" />
                                        <div className="flex gap-6">
                                            <div className="h-4 w-16 bg-warm-200 rounded" />
                                            <div className="h-4 w-20 bg-warm-200 rounded" />
                                            <div className="h-4 w-14 bg-warm-200 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-20 bg-white/50 rounded-2xl border border-warm-300 border-dashed">
                                <p className="text-warm-500 font-medium">No posts in your feed yet.</p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <div className="mb-6" key={post.id}>
                                    <PostCard
                                        post={post}
                                        onPress={() => openPostDetails(post)}
                                        onLike={(e) => {
                                            e.stopPropagation();
                                            handleLikePost(post);
                                        }}
                                        onComment={(e) => {
                                            e.stopPropagation();
                                            openPostDetails(post);
                                        }}
                                        onShare={(e) => {
                                            e.stopPropagation();
                                            handleSharePost(post);
                                        }}
                                    />
                                </div>
                            ))
                        )}
                        
                        {!loading && posts.length > 0 && (
                            <div className="text-center py-10 pt-4">
                                <p className="text-warm-400 font-medium text-sm">You&apos;ve reached the end of the feed.</p>
                                <p className="text-warm-400 text-xs mt-1 italic">Try refreshing to see new content.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDEBAR (Desktop Post Detail Overlay) */}
                <div className="lg:relative lg:h-full hidden lg:block mt-8">
                    <div className="lg:sticky lg:top-16 lg:h-[calc(100vh-8rem)] w-full">
                        <AnimatePresence mode="wait">
                            {selectedPost ? (
                                <motion.div
                                    key={selectedPost.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-[calc(100vh-8rem)] w-full shadow-2xl rounded-2xl bg-warm-100 border border-warm-300 overflow-hidden"
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
                                    className="h-full border-2 border-dashed border-warm-300 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-gray-50/50"
                                >
                                    <MessageCircle className="w-12 h-12 text-warm-400 mb-4" />
                                    <h3 className="text-warm-700 font-semibold mb-2">Select a Post</h3>
                                    <p className="text-warm-500 text-sm">Click any post from your feed to view details, read comments, and join the discussion.</p>
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
                        className="fixed inset-0 z-50 xl:hidden bg-warm-100"
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
                                <div className="max-w-[700px] mx-auto xl:mx-0 w-full px-2 lg:px-4 z-40 bg-white/60 backdrop-blur-xl border-t border-warm-200/60 lg:border lg:shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.12)] lg:rounded-t-[32px] md:rounded-t-[32px] pointer-events-auto">
                                    <div className="py-2">
                                        <CreatePostCard
                                            communities={communities}
                                            channels={channels}
                                            onSubmit={handleCreatePost}
                                            userAvatar={user?.avatar_url || 'https://via.placeholder.com/40'}
                                            minimal={true}
                                            trailing={
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <div className="h-8 w-[1.5px] bg-warm-200/60 mx-1 hidden sm:block" />
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-warm-50/50 hover:bg-warm-100/80 transition-all rounded-full text-[13px] sm:text-sm font-bold text-warm-700 border border-transparent whitespace-nowrap shadow-sm active:scale-95">
                                                                <Filter size={16} className="text-warm-500 hidden xs:block" />
                                                                <span className="max-w-[100px] sm:max-w-[150px] truncate">
                                                                    {selectedCommunityFilter
                                                                        ? communities.find(c => c.id === selectedCommunityFilter)?.name
                                                                        : 'All Communities'}
                                                                </span>
                                                                <ChevronDown size={14} className="text-warm-400" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" side="top" className="w-[240px] rounded-2xl p-2 bg-white/95 backdrop-blur-xl border-warm-200 shadow-2xl z-[100] mb-2">
                                                            <div className="px-3 py-2 text-[11px] font-bold text-warm-400 uppercase tracking-wider">Feed Filter</div>
                                                            <DropdownMenuItem
                                                                onClick={() => setSelectedCommunityFilter(null)}
                                                                className={`rounded-xl cursor-pointer py-2.5 px-3 mb-1 transition-colors ${!selectedCommunityFilter ? 'bg-[#3c2a34] text-white font-bold hover:bg-[#3c2a34] hover:text-white' : 'text-warm-600 hover:bg-warm-50'}`}
                                                            >
                                                                All Communities
                                                            </DropdownMenuItem>
                                                            <div className="h-px bg-warm-100 my-1 mx-2" />
                                                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                                                {communities.length > 0 ? (
                                                                    communities.map((comm) => (
                                                                        <DropdownMenuItem
                                                                            key={comm.id}
                                                                            onClick={() => setSelectedCommunityFilter(comm.id)}
                                                                            className={`rounded-xl cursor-pointer py-2.5 px-3 mb-1 transition-colors ${selectedCommunityFilter === comm.id
                                                                                ? 'bg-[#3c2a34] text-white font-bold hover:bg-[#3c2a34] hover:text-white'
                                                                                : 'text-warm-600 hover:bg-warm-50'
                                                                                }`}
                                                                        >
                                                                            <div className="flex items-center gap-3 w-full min-w-0">

                                                                                {comm.logo_url ? (
                                                                                    <Image
                                                                                        src={comm.logo_url}
                                                                                        alt="Logo"
                                                                                        width={24}
                                                                                        height={24}
                                                                                        className="rounded-full w-6 h-6 shrink-0"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="w-6 h-6 rounded-full bg-[#3c2a34] shrink-0" />
                                                                                )}

                                                                                <span className="font-medium text-warm-700 truncate">
                                                                                    {comm.name}
                                                                                </span>

                                                                            </div>
                                                                        </DropdownMenuItem>
                                                                    ))
                                                                ) : (
                                                                    <div className="px-3 py-8 text-center">
                                                                        <Info size={24} className="mx-auto text-warm-200 mb-2" />
                                                                        <p className="text-xs text-warm-400">Join communities to see them here</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            }
                                        />
                                    </div>
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
