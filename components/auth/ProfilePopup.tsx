'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Camera, ChevronDown, Check, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

const COUNTRIES = [
    { label: 'United States', flag: '🇺🇸', code: 'us' },
    { label: 'United Kingdom', flag: '🇬🇧', code: 'gb' },
    { label: 'India', flag: '🇮🇳', code: 'in' },
    { label: 'Canada', flag: '🇨🇦', code: 'ca' },
    { label: 'Australia', flag: '🇦🇺', code: 'au' },
    { label: 'Germany', flag: '🇩🇪', code: 'de' },
    { label: 'France', flag: '🇫🇷', code: 'fr' },
    { label: 'Japan', flag: '🇯🇵', code: 'jp' },
    { label: 'Brazil', flag: '🇧🇷', code: 'br' },
    { label: 'South Africa', flag: '🇿🇦', code: 'za' },
];

export default function ProfilePopup() {
    const { user, refreshUser } = useAuth();
    const { toast } = useToast();

    const capitalizeWords = (text: string) =>
        text
            ? text
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            : '';

    const initialName = user?.name === user?.email?.split('@')[0] ? '' : (user?.name || '');

    const [name, setName] = useState(capitalizeWords(initialName));
    const [bio, setBio] = useState(user?.bio || '');
    const [country, setCountry] = useState<{ label: string; flag: string; code: string } | null>(
        user?.country ? COUNTRIES.find(c => c.label === user.country) || null : null
    );
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url || null);

    const [showCountryModal, setShowCountryModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isFormValid = name.trim().length > 0 && bio.trim().length >= 20 && country !== null && avatarUrl !== null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 10 * 1024 * 1024) {
                toast({
                    title: "File too large",
                    description: "File should not be more than 10 MB.",
                    variant: "destructive",
                });
                return;
            }
            setAvatarFile(file);
            setAvatarUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!isFormValid) {
            toast({
                title: "Validation error",
                description: "All fields are required, and bio must be at least 20 characters.",
                variant: "destructive",
            });
            return;
        }
        if (!user) {
            toast({
                title: "Error",
                description: "Critical error: auth session missing.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            let finalAvatarUrl = avatarUrl;

            // Upload Image if it's a new file
            if (avatarFile) {
                const filename = `${user.id}_${Date.now()}.jpg`;
                const path = `avatars/${filename}`;

                const arrayBuffer = await avatarFile.arrayBuffer();

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(path, arrayBuffer, { contentType: avatarFile.type });

                if (uploadError) {
                    throw new Error('Failed to upload avatar. Ensure "avatars" bucket allows uploads.');
                }

                const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(path);
                finalAvatarUrl = publicUrlData.publicUrl;
            }

            // Upsert into public.users
            const { error } = await supabase.from('users').upsert({
                id: user.id,
                email: user.email,
                name: name.trim(),
                country: country?.label,
                bio: bio.trim(),
                avatar_url: finalAvatarUrl,
                is_verified: true, // Should be true since they got past OTP
                is_active: true
            }, { onConflict: 'id' });

            if (error) throw error;

            // Welcome Notification
            await supabase.from('notifications').insert({
                user_id: user.id,
                notification_type: 'system_announcement',
                category: 'success',
                title: 'Welcome to Pentasent!',
                message: 'Your account is fully set up. Dive into your new communities and explore!',
                is_seen: false,
                is_active: true
            });

            toast({
                title: "Profile saved!",
            });
            await refreshUser();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || 'Failed to finish setting up your profile.',
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 overflow-y-auto pt-10 pb-10 no-scrollbar">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-8 relative flex flex-col my-auto"
                >
                    <div className="mb-6 text-center">
                        <h3 className="text-3xl font-semibold text-[#3d2f4d] mb-1">
                            Complete Profile
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Tell us a bit about yourself
                        </p>
                    </div>

                    <div className="flex flex-col gap-5">
                        {/* Avatar */}
                        <div className="flex justify-center mb-2">
                            <div
                                className="relative cursor-pointer group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                                    {avatarUrl ? (
                                        <Image src={avatarUrl} alt="Avatar" width={96} height={96} className="object-cover w-full h-full" />
                                    ) : (
                                        <Camera className="w-8 h-8 text-gray-400 group-hover:text-gray-600 transition" />
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-[#3d2f4d] w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                                    <Camera className="w-4 h-4 text-white" />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        {/* Email (Disabled) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none"
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e8d4df] outline-none transition"
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location (Country)</label>
                            <button
                                onClick={() => setShowCountryModal(true)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e8d4df] outline-none transition flex justify-between items-center text-left"
                            >
                                <span className={country ? 'text-gray-800 flex items-center gap-2' : 'text-gray-400'}>
                                    {country ? (
                                        <>
                                            <Image src={`https://flagcdn.com/w40/${country.code}.png`} alt={country.label} width={24} height={16} className="rounded-sm object-cover" />
                                            {country.label}
                                        </>
                                    ) : 'Select your country'}
                                </span>
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                                placeholder="Share a little about yourself..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                maxLength={500}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e8d4df] outline-none transition h-28 resize-none"
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">
                                {bio.length}/500
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !isFormValid}
                            className="w-full py-4 rounded-xl bg-[#3d2f4d] text-white font-medium hover:bg-[#2d1f3d] transition-all flex items-center justify-center disabled:opacity-70 mt-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Setup"}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Country Selection Modal */}
            <AnimatePresence>
                {showCountryModal && (
                    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center p-0 sm:p-4 ">
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 200, opacity: 0 }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[70vh] sm:h-auto sm:max-h-[80vh]"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800">Select Country</h3>
                                <button onClick={() => setShowCountryModal(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* List */}
                            <div className="overflow-y-auto px-2 py-2 flex-1 ">
                                {COUNTRIES.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => {
                                            setCountry(item);
                                            setShowCountryModal(false);
                                        }}
                                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Image src={`https://flagcdn.com/w40/${item.code}.png`} alt={item.label} width={24} height={16} className="rounded-sm shadow-sm" />
                                            <span className="text-gray-800 font-medium">{item.label}</span>
                                        </div>
                                        {country?.label === item.label && (
                                            <Check className="w-5 h-5 text-[#3d2f4d]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
