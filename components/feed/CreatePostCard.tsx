'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, ChevronDown, Check, X } from 'lucide-react';
import { Community, Channel } from '@/types/database';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { parseContent } from '@/lib/format';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { SmartImage } from '../ui/SmartImage';

interface CreatePostCardProps {
    communities: Community[];
    channels: Channel[];
    onSubmit: (data: {
        community_id: string;
        channel_ids: string[];
        title: string;
        content: string;
        images: File[];
    }) => Promise<void>;
    userAvatar?: string;
    minimal?: boolean;
    trailing?: React.ReactNode;
}

export const CreatePostCard: React.FC<CreatePostCardProps> = ({
    communities,
    channels,
    onSubmit,
    userAvatar = 'https://via.placeholder.com/40',
    minimal = false,
    trailing
}) => {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
    const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

    const [showCommPicker, setShowCommPicker] = useState(false);
    const [showChanPicker, setShowChanPicker] = useState(false);

    const MAX_TITLE_LENGTH = 50;

    const filteredChannels = selectedCommunityId
        ? channels.filter(c => c.community_id === selectedCommunityId)
        : [];

    const selectedCommunity = communities.find(c => c.id === selectedCommunityId);
    const selectedChannel = channels.find(c => c.id === selectedChannelId);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "File should not be more than 5MB.",
                variant: "destructive",
            });
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Only JPG, PNG and SVG are allowed.",
                variant: "destructive",
            });
            return;
        }

        setImages(prev => [...prev, file]);
        setImagePreviews(prev => [...prev, URL.createObjectURL(file)]);
    };

    const removeImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setImages([]);
        setImagePreviews([]);
        setSelectedCommunityId(null);
        setSelectedChannelId(null);
        setShowCommPicker(false);
        setShowChanPicker(false);
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const handleSubmit = async () => {
        if (!selectedCommunityId) {
            toast({
                title: "Required",
                description: "Please select a community to post in.",
                variant: "destructive",
            });
            return;
        }
        if (!selectedChannelId) {
            toast({
                title: "Required",
                description: "Please select a channel to post in.",
                variant: "destructive",
            });
            return;
        }
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
            await onSubmit({
                community_id: selectedCommunityId,
                channel_ids: [selectedChannelId],
                title,
                content,
                images
            });
            toast({
                title: "Post created!",
                description: "Post created successfully!",
            });
            handleClose();
        } catch (err: any) {
            toast({
                title: "Upload failed",
                description: err.message || 'Failed to create post.',
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`bg-white/80 backdrop-blur-md shadow-sm border border-warm-200/60 ${minimal ? 'p-1.5 px-2 rounded-full' : 'rounded-[20px] mb-6 p-4'}`}>
            <div className="flex items-center gap-3 w-full">
                <Image
                    src={userAvatar}
                    alt="User"
                    width={minimal ? 40 : 48}
                    height={minimal ? 40 : 48}
                    className={`rounded-full bg-warm-200 object-cover ${minimal ? 'w-10 h-10' : 'w-12 h-12'} shrink-0 border border-warm-300`}
                />

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <button className={`flex-1 ${minimal ? 'bg-warm-50/50 py-2.5' : 'bg-[#F8F2EE] py-3'} hover:bg-warm-100/80 transition-colors rounded-full px-5 text-left text-warm-500 font-medium border border-transparent truncate`}>
                            What do you want to share?
                        </button>
                    </DialogTrigger>
                    {trailing}
                    <DialogContent className="w-full h-full sm:max-h-[90vh] sm:max-w-[600px] overflow-hidden sm:overflow-visible rounded-none sm:rounded-3xl p-0 gap-0 border-0 flex flex-col pt-3 sm:pt-0">
                        <DialogHeader className="px-6 pb-4 md:pt-4 lg:pt-4 border-b border-warm-300">
                            <div className="flex items-center justify-between">
                                <DialogTitle className="text-xl font-bold text-warm-700">Create Post</DialogTitle>
                                {/* <X className='h-6 w-6 text-warm-600' onClick={handleClose} /> */}
                            </div>
                        </DialogHeader>

                        <div className="flex flex-col p-6 overflow-y-auto max-h-[80vh] scrollbar-hide snap-x snap-mandatory">
                            {/* Pickers container */}
                            <div className="flex flex-col gap-4 mb-4 relative z-50">
                                {/* Community Selector */}
                                <div className="relative">
                                    <button
                                        className="flex items-center justify-between w-full p-3 rounded-xl border border-warm-300 bg-warm-100 hover:bg-warm-200 text-left"
                                        onClick={() => { setShowCommPicker(!showCommPicker); setShowChanPicker(false); }}
                                    >
                                        <div className="flex items-center gap-3">
                                            {selectedCommunity?.logo_url ? (
                                                <Image src={selectedCommunity.logo_url} alt="Logo" width={24} height={24} className="rounded-full w-6 h-6" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-[#3c2a34]" />
                                            )}
                                            <span className="font-medium text-warm-700">
                                                {selectedCommunity ? selectedCommunity.name : 'Select Community'}
                                            </span>
                                        </div>
                                        <ChevronDown size={20} className="text-warm-400" />
                                    </button>

                                    {showCommPicker && (
                                        <div className="absolute top-14 left-0 w-full bg-warm-100 border border-warm-300 rounded-xl shadow-lg z-[60] max-h-60 overflow-y-auto py-2 scrollbar-hide">

                                            {communities.map(comm => (
                                                <button
                                                    key={comm.id}
                                                    onClick={() => {
                                                        setSelectedCommunityId(comm.id);
                                                        setSelectedChannelId(null);
                                                        setShowCommPicker(false);
                                                    }}
                                                    className="flex w-full items-center px-4 py-3 hover:bg-warm-200"
                                                >
                                                    {/* LEFT SIDE */}
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">

                                                        {comm.logo_url ? (
                                                            <div className="w-6 h-6 rounded-full bg-warm-200 overflow-hidden shrink-0 relative">
                                                                <SmartImage
                                                                    src={comm.logo_url || 'https://via.placeholder.com/40'}
                                                                    alt="avatar"
                                                                    className="object-cover"
                                                                    fallbackIconSize={20}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />
                                                        )}

                                                        <span
                                                            className={`text-sm truncate ${selectedCommunityId === comm.id
                                                                ? "font-semibold text-[#3c2a34]"
                                                                : "text-warm-700"
                                                                }`}
                                                        >
                                                            {comm.name}
                                                        </span>
                                                    </div>

                                                    {/* RIGHT ICON */}
                                                    {selectedCommunityId === comm.id && (
                                                        <Check size={16} className="text-[#3c2a34] shrink-0 ml-3" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Channel Selector & Image Upload inline */}
                                {selectedCommunityId && (
                                    <div className="flex items-center gap-3 relative">
                                        <button
                                            className="flex-1 flex items-center justify-between p-3 rounded-xl border border-warm-300 bg-warm-100 hover:bg-warm-200 text-left"
                                            onClick={() => setShowChanPicker(!showChanPicker)}
                                        >
                                            <span className="font-medium text-warm-700">
                                                {selectedChannel ? `#${selectedChannel.name}` : '# Select Channel'}
                                            </span>
                                            <ChevronDown size={20} className="text-warm-400" />
                                        </button>

                                        {showChanPicker && (
                                            <div className="absolute top-14 left-0 sm:w-[60%] w-full bg-warm-100 border border-warm-300 rounded-xl shadow-lg z-[60] max-h-60 overflow-y-auto py-2 scrollbar-hide snap-x snap-mandatory">
                                                {filteredChannels.length > 0 ? filteredChannels.map(ch => (
                                                    <button
                                                        key={ch.id}
                                                        onClick={() => { setSelectedChannelId(ch.id); setShowChanPicker(false); }}
                                                        className="flex w-full items-center justify-between px-4 py-3 hover:bg-warm-200"
                                                    >
                                                        <span className={`text-sm ${selectedChannelId === ch.id ? 'font-semibold text-[#3c2a34]' : 'text-warm-700'}`}>#{ch.name}</span>
                                                        {selectedChannelId === ch.id && <Check size={16} className="text-[#3c2a34]" />}
                                                    </button>
                                                )) : <div className="p-4 text-sm text-warm-500 italic">No channels available</div>}
                                            </div>
                                        )}

                                        <label className="shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 rounded-xl border border-warm-300 bg-warm-200 text-[#3c2a34] font-semibold cursor-pointer hover:bg-warm-200 transition-colors">
                                            <ImageIcon size={20} />
                                            <span className="hidden sm:inline">Add Image</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="flex gap-4 mb-4 overflow-x-auto pb-4 pt-3 pl-1 pr-3 scrollbar-hide snap-x snap-mandatory">
                                    {imagePreviews.map((img, idx) => (
                                        <div key={idx} className="relative w-20 h-20 shrink-0 border border-warm-300 rounded-lg">
                                            {/* <Image src={img} alt="preview" fill className="object-cover rounded-lg" /> */}
                                            <SmartImage
                                                src={img}
                                                alt="preview"
                                                className="object-cover rounded-lg"
                                                fallbackIconSize={40}
                                            />
                                            <button
                                                onClick={() => removeImage(idx)}
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
                            <Button variant="ghost" onClick={handleClose} disabled={loading} className="text-warm-500 rounded-full px-4 sm:px-6">
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#3c2a34] hover:bg-[#2e2028] text-white rounded-full px-6 sm:px-8 py-2 font-semibold"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Posting...' : 'Post'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {!minimal && (
                <div className="flex items-center justify-between mt-4 px-2 border-t border-gray-50 pt-2 text-sm text-warm-500 font-medium">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setOpen(true)} className="flex items-center gap-2 hover:text-gray-700 transition-colors">
                            <ImageIcon size={20} className="text-warm-400" />
                            Media
                        </button>
                        {/* Placeholder for other potential feeds actions */}
                    </div>
                    <Button className="bg-[#3c2a34] hover:bg-[#2a1c24] text-white rounded-full px-8 font-semibold shadow-sm" onClick={() => setOpen(true)}>
                        Post
                    </Button>
                </div>
            )}
        </div>
    );
};
