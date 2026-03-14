import React, { useState, useEffect } from 'react';
import { Post, Community, Channel } from '@/types/database';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronDown, X } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface EditPostDialogProps {
    post: Post;
    communities: Community[];
    channels: Channel[];
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, content: string, imagesToRemove: string[], newImages: File[]) => Promise<void>;
}

export const EditPostDialog: React.FC<EditPostDialogProps> = ({
    post,
    communities,
    channels,
    isOpen,
    onClose,
    onSubmit
}) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(post.title || '');
    const [content, setContent] = useState('');

    // Image handling
    const [existingImages, setExistingImages] = useState<any[]>(post.images || []);
    const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

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
            setExistingImages(post.images || []);
            setImagesToRemove([]);
            setNewImages([]);
            setImageUrls([]);
        }
    }, [isOpen, post]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const validFiles = filesArray.filter(file => {
                const isValidType = ['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type);
                const isValidSize = file.size <= 5 * 1024 * 1024;
                if (!isValidType) toast({ title: "Invalid file type", description: `${file.name} is not a valid image(JPG, PNG, SVG only).`, variant: "destructive" });
                if (!isValidSize) toast({ title: "File too large", description: `${file.name} exceeds 5MB limit.`, variant: "destructive" });
                return isValidType && isValidSize;
            });

            setNewImages(prev => [...prev, ...validFiles]);

            validFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => setImageUrls(prev => [...prev, reader.result as string]);
                reader.readAsDataURL(file);
            });
        }
    };

    const removeExistingImage = (imageId: string) => {
        setExistingImages(prev => prev.filter(img => img.id !== imageId));
        setImagesToRemove(prev => [...prev, imageId]);
    };

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const selectedCommunity = communities.find(c => c.id === post.community_id);
    const selectedChannel = channels.find(c => post.channels?.some(pc => pc.id === c.id));

    const handleSubmit = async () => {
        if (title.trim().length < 10 && title.trim().length > 0) {
            toast({
                title: "Invalid Title",
                description: "Title must be at least 10 characters long.",
                variant: "destructive",
            });
            return;
        }
        if (content.trim().length < 20) {
            toast({
                title: "Invalid Description",
                description: "Description must be at least 20 characters long.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            await onSubmit(title, content, imagesToRemove, newImages);
            toast({
                title: "Post updated!",
            });
            onClose();
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || 'Failed to update post.',
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-full h-full sm:max-h-[90vh] sm:max-w-[600px] overflow-hidden sm:overflow-visible rounded-none sm:rounded-3xl p-0 gap-0 border-0 flex flex-col pt-3 sm:pt-0">
                <DialogHeader className="px-6 pb-4 md:pt-4 lg:pt-4 border-b border-warm-300">
                    <DialogTitle className="text-xl font-bold text-warm-700">Edit Post</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col p-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
                    <div className="flex flex-col gap-4 mb-4 relative z-50">
                        <div className="relative cursor-not-allowed">
                            <button className="flex items-center justify-between w-full p-3 rounded-xl border border-warm-300 bg-warm-200 text-left pointer-events-none opacity-70">
                                <div className="flex items-center gap-3">
                                    {selectedCommunity?.logo_url ? (
                                        <Image src={selectedCommunity.logo_url} alt="Logo" width={24} height={24} className="rounded-full w-6 h-6 object-cover" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-[#3c2a34]" />
                                    )}
                                    <span className="font-medium text-warm-700">
                                        {selectedCommunity ? selectedCommunity.name : 'Select Community'}
                                    </span>
                                </div>
                                <ChevronDown size={20} className="text-warm-400" />
                            </button>
                        </div>

                        {/* Channel & Image Inline - Disabled Channel */}
                        {(selectedChannel || true) && (
                            <div className="flex items-center gap-3 relative">
                                <div className="flex-1 relative opacity-70 cursor-not-allowed">
                                    <button className="flex items-center justify-between w-full p-3 rounded-xl border border-warm-300 bg-warm-200 text-left pointer-events-none">
                                        <span className="font-medium text-warm-700">
                                            #{selectedChannel?.name || 'Channel'}
                                        </span>
                                        <ChevronDown size={20} className="text-warm-400" />
                                    </button>
                                </div>

                                <label className="shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 rounded-xl border border-warm-300 bg-warm-200 text-[#3c2a34] font-semibold cursor-pointer hover:bg-warm-200 transition-colors z-50 relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                    <span className="hidden sm:inline">Add Image</span>
                                    <input type="file" className="hidden" accept="image/jpeg, image/png, image/svg+xml" multiple onChange={handleImageChange} />
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Image Previews */}
                    {(existingImages.length > 0 || imageUrls.length > 0) && (
                        <div className="flex gap-4 mb-4 overflow-x-auto pb-4 pt-3 pl-1 pr-3 custom-scrollbar relative z-10 w-full">
                            {existingImages.map((img: any) => (
                                <div key={img.id} className="relative w-20 h-20 shrink-0 border border-warm-300 rounded-lg">
                                    <Image src={img.image_url} alt="existing preview" fill className="object-cover rounded-lg" />
                                    <button
                                        onClick={() => removeExistingImage(img.id)}
                                        className="absolute top-1 right-1 bg-gray-900 bg-opacity-70 p-1 rounded-full text-white hover:bg-opacity-100 z-10 shadow-sm"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            {imageUrls.map((url, index) => (
                                <div key={index} className="relative w-20 h-20 shrink-0 border border-warm-300 rounded-lg">
                                    <Image src={url} alt={`preview ${index}`} fill className="object-cover rounded-lg" />
                                    <button
                                        onClick={() => removeNewImage(index)}
                                        className="absolute top-1 right-1 bg-gray-900 bg-opacity-70 p-1 rounded-full text-white hover:bg-opacity-100 z-10 shadow-sm"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Inputs */}
                    <div className="flex flex-col gap-2 relative z-10 w-full mb-4">
                        <div className="flex items-center justify-between border-b border-transparent focus-within:border-gray-200 pb-2">
                            <input
                                className="text-lg font-bold text-warm-700 placeholder:text-gray-400 w-full bg-transparent outline-none"
                                placeholder="Title (Optional)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value.substring(0, MAX_TITLE_LENGTH))}
                            />
                            <span className="text-xs text-warm-400 whitespace-nowrap">{title.length}/{MAX_TITLE_LENGTH}</span>
                        </div>
                        <textarea
                            className="w-full text-[15px] scrollbar-hide snap-x snap-mandatory sm:text-base text-warm-700 placeholder:text-gray-400 bg-transparent min-h-[160px] resize-none outline-none leading-relaxed mt-2 pb-[100px]"
                            placeholder="What do you want to share?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                </div>

                {/* Sticky Bottom Actions */}
                <div className="mt-auto absolute bottom-0 left-0 w-full bg-warm-100 flex justify-end gap-3 pt-3 pb-4 sm:pb-5 px-6 border-t border-warm-300 z-[100] sm:rounded-b-3xl">
                    <Button variant="ghost" onClick={onClose} disabled={loading} className="text-warm-500 rounded-full px-4 sm:px-6">
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
