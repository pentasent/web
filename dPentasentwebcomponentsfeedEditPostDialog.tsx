import React, { useState, useEffect } from 'react';
import { Post, Community, Channel } from '@/types/database';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface EditPostDialogProps {
    post: Post;
    communities: Community[];
    channels: Channel[];
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, content: string) => Promise<void>;
}

export const EditPostDialog: React.FC<EditPostDialogProps> = ({
    post,
    communities,
    channels,
    isOpen,
    onClose,
    onSubmit
}) => {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(post.title || '');
    const [content, setContent] = useState('');

    const MAX_TITLE_LENGTH = 50;

    useEffect(() => {
        if (isOpen) {
            setTitle(post.title || '');
            let postText = '';
            if (post.content && typeof post.content === 'object' && 'content' in (post.content as any)) {
                const docContent = (post.content as any).content || [];
                const paragraphs = docContent.filter((n: any) => n.type === 'paragraph');
                postText = paragraphs.map((p: any) => p.content?.map((textNode: any) => textNode.text || '').join('') || '').join('\n');
            } else if (typeof post.content === 'string') {
                postText = post.content;
            }
            setContent(postText);
        }
    }, [isOpen, post]);

    const selectedCommunity = communities.find(c => c.id === post.community_id);
    const selectedChannel = channels.find(c => post.channels?.some(pc => pc.id === c.id)); // post.channels may be an array in some joins or just check all channels if we joined appropriately. Actually feed query joins `channels:channels(id, name)`. This might be an object or array.
    
    // In page.tsx: `channels:channels(id, name)` typically returns single object if it's a many-to-one, but channels is usually joined through post_channels if many-to-many.
    // Given the CreatePostCard expects channel_ids[], it might be many-to-many. Let's just use the community.
    
    // Actually, looking at CreatePostCard, it expects community_id and channel_ids array. Wait, in page.tsx insert: `community_id: data.community_id`. But for channels, it ignores `channel_ids` on insert!
    // It doesn't insert channels. Let's ignore channels for now or just show a disabled state.
    
    const handleSubmit = async () => {
        if (title.trim().length < 10 && title.trim().length > 0) {
            toast.error('Title must be at least 10 characters long.');
            return;
        }
        if (content.trim().length < 20) {
            toast.error('Description must be at least 20 characters long.');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(title, content);
            toast.success('Post updated successfully!');
            onClose();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-full h-full sm:max-h-[80vh] sm:max-w-[600px] overflow-hidden sm:overflow-visible rounded-none sm:rounded-3xl p-0 gap-0 border-0 flex flex-col pt-3 sm:pt-0">
                <DialogHeader className="px-6 py-4 border-b border-gray-100">
                    <DialogTitle className="text-xl font-bold text-gray-900">Edit Post</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                    <div className="flex flex-col gap-4 mb-4 relative z-50">
                        <div className="relative opacity-70 cursor-not-allowed">
                            <button className="flex items-center justify-between w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-left pointer-events-none">
                                <div className="flex items-center gap-3">
                                    {selectedCommunity?.logo_url ? (
                                        <Image src={selectedCommunity.logo_url} alt="Logo" width={24} height={24} className="rounded-full w-6 h-6 object-cover" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-[#3c2a34]" />
                                    )}
                                    <span className="font-medium text-gray-800">
                                        {selectedCommunity ? selectedCommunity.name : 'Unknown Community'}
                                    </span>
                                </div>
                                <ChevronDown size={20} className="text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 relative z-10 w-full mb-4">
                        <div className="flex items-center justify-between border-b border-transparent focus-within:border-gray-200 pb-2">
                            <input
                                className="text-lg font-bold text-gray-900 placeholder:text-gray-400 w-full bg-transparent outline-none"
                                placeholder="Title (Optional)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value.substring(0, MAX_TITLE_LENGTH))}
                            />
                            <span className="text-xs text-gray-400 whitespace-nowrap">{title.length}/{MAX_TITLE_LENGTH}</span>
                        </div>
                        <textarea
                            className="w-full text-[15px] sm:text-base text-gray-800 placeholder:text-gray-400 bg-transparent min-h-[160px] resize-none outline-none leading-relaxed mt-2 pb-[100px]"
                            placeholder="What do you want to share?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-auto absolute bottom-0 left-0 w-full bg-white flex justify-end gap-3 pt-3 pb-4 sm:pb-5 px-6 border-t border-gray-100 z-[100] sm:rounded-b-3xl">
                    <Button variant="ghost" onClick={onClose} disabled={loading} className="text-gray-500 rounded-full px-4 sm:px-6">
                        Cancel
                    </Button>
                    <Button
                        className="bg-[#3c2a34] hover:bg-[#2e2028] text-white rounded-full px-6 sm:px-8 py-2 font-semibold"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
