'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Camera, Check, ChevronDown } from 'lucide-react';
import { COUNTRIES } from '@/lib/country';
import Image from 'next/image';
import { GlobalLayout } from '@/components/layout/global-layout';

export default function EditProfilePage() {

    const { user, loading: authLoading, refreshUser } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [country, setCountry] = useState<{ label: string; code: string } | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) router.replace('/signin');
        else if (user) {
            setName(user.name || '');
            setBio(user.bio || '');
            if (user.country) {
                const found = COUNTRIES.find(c => c.label === user.country);
                setCountry(found || { label: user.country, code: 'other' });
            }
            setAvatarUrl(user.avatar_url || null);
        }
    }, [user, authLoading, router]);

    const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "File should not exceed 10MB.",
                variant: "destructive",
            });
            return;
        }

        setAvatarFile(file);
        setAvatarUrl(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        if (!user) return;

        if (!name.trim()) {
            toast({
                title: "Validation Error",
                description: "Name cannot be empty.",
                variant: "destructive",
            });
            return;
        }

        if (bio.trim().length > 0 && bio.trim().length < 20) {
            toast({
                title: "Validation Error",
                description: "Bio must be at least 20 characters.",
                variant: "destructive",
            });
            return;
        }

        if (!country) {
            toast({
                title: "Validation Error",
                description: "Please select a country.",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);

        try {

            let finalAvatarUrl = user.avatar_url;

            if (avatarFile) {

                const fileExt = avatarFile.name.split('.').pop() || 'jpg';
                const fileName = `${user.id}_${Date.now()}.${fileExt}`;
                const filePath = `avatars/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, avatarFile, { cacheControl: '3600', upsert: false });

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
                finalAvatarUrl = data.publicUrl;

            }

            const { error } = await supabase
                .from('users')
                .update({
                    name: name.trim(),
                    country: country.label,
                    bio: bio.trim(),
                    avatar_url: finalAvatarUrl
                })
                .eq('id', user.id);

            if (error) throw error;

            toast({
                title: "Profile Updated",
                description: "Your profile has been saved successfully.",
            });

            await refreshUser();
            router.push('/app/profile');

        } catch (error: any) {

            toast({
                title: "Update Failed",
                description: error.message || "Failed to update profile.",
                variant: "destructive",
            });

        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading) {
        return (
          <GlobalLayout />
        );
    }

    if (!user) return null;

    return (

        <div className="min-h-screen bg-[#fffbf7] pb-20">

            <div className="max-w-[720px] mx-auto px-4 mt-20 xl:mt-6 lg:mt-4">

                {/* Header */}

                <div className="flex items-center flex-wrap justify-between mb-10">

                    <div className="flex items-center gap-4 mb-4 lg:mb-0 md:mb-0">

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="h-10 w-10 rounded-xl border border-warm-200 bg-white hover:bg-warm-50"

                        >

                            <ArrowLeft className="h-5 w-5 text-[#3d2f4d]" />
                        </Button>

                        <div>
                            <h1 className="text-2xl font-bold text-[#3d2f4d] font-serif">
                                Edit Profile
                            </h1>
                            <p className="text-sm text-warm-500 font-medium">
                                Customize your public presence
                            </p>
                        </div>

                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#3d2f4d] hover:bg-[#2a1f35] text-white rounded-xl px-8 h-12 shadow-sm transition-all"

                    >

                        {isSaving ? (
                            <> <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}

                    </Button>

                </div>

                {/* Card */}

                <div className="bg-white border border-warm-200 rounded-3xl p-8 sm:p-10 shadow-sm transition-all">

                    {/* Avatar Selection */}

                    <div className="flex flex-col items-center mb-12">

                        <div
                            className="relative cursor-pointer group"
                            onClick={() => fileInputRef.current?.click()}
                        >

                            <div className="p-1.5 border-2 border-warm-100 rounded-[2rem] bg-white transition-transform group-hover:scale-[1.02]">
                                <Avatar className="h-32 w-32 rounded-[1.8rem] border border-warm-200">
                                    <AvatarImage src={avatarUrl || "https://api.pentasent.com/storage/v1/object/public/avatars/placeholders/icon.png"} />
                                    <AvatarFallback className="text-4xl bg-warm-50 text-[#3d2f4d] font-serif">
                                        {name.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="absolute inset-2 rounded-[1.8rem] bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                <Camera className="h-8 w-8 text-white" />
                            </div>

                        </div>

                        <p
                            className="text-xs font-bold uppercase tracking-widest text-warm-400 mt-6 cursor-pointer hover:text-[#3d2f4d] transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Change Profile Photo
                        </p>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImagePick}
                        />

                    </div>

                    {/* Form Fields */}

                    <div className="space-y-8 max-w-md mx-auto">

                        {/* Name Field */}

                        <div className="space-y-2.5">

                            <Label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">
                                Full Name
                            </Label>

                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="h-12 bg-warm-50/50 border-warm-200 focus-visible:ring-warm-300 rounded-2xl text-base px-5 font-medium shadow-sm transition-all"
                            />

                        </div>

                        {/* Country Selection */}

                        <div className="space-y-2.5 relative">

                            <Label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">
                                Location / Country
                            </Label>

                            <button
                                type="button"
                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                className="w-full h-12 flex items-center justify-between border bg-warm-50/50 border-warm-200 rounded-2xl px-5 transition-all hover:bg-warm-100/50"

                            >

                                <span className="flex items-center gap-3 text-sm font-medium text-warm-700">

                                    {country ? (
                                        <>
                                            {country.code !== "other" ? (
                                                <Image
                                                    src={`https://flagcdn.com/w40/${country.code}.png`}
                                                    alt={country.label}
                                                    width={22}
                                                    height={15}
                                                    className="rounded-sm shadow-sm"
                                                />
                                            ) : <span className="text-lg">🌍</span>}
                                            {country.label}
                                        </>
                                    ) : (
                                        <span className="text-warm-400 font-normal">Select your country</span>
                                    )}

                                </span>

                                <ChevronDown className="h-4 w-4 text-warm-300" />

                            </button>

                            {showCountryDropdown && (
                                <>

                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowCountryDropdown(false)}
                                    />

                                    <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-warm-200 rounded-2xl shadow-xl py-2 no-scrollbar animate-in fade-in zoom-in duration-150">
                                        {COUNTRIES.map((c) => (

                                            <button
                                                key={c.label}
                                                type="button"
                                                onClick={() => {
                                                    setCountry(c);
                                                    setShowCountryDropdown(false);
                                                }}
                                                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-warm-50 transition-colors"

                                            >

                                                <div className="flex items-center gap-4">

                                                    {c.code !== "other" ? (
                                                        <Image
                                                            src={`https://flagcdn.com/w40/${c.code}.png`}
                                                            alt={c.label}
                                                            width={22}
                                                            height={15}
                                                            className="rounded-sm shadow-sm"
                                                        />
                                                    ) : (<span className="text-lg">🌍</span>
                                                    )}

                                                    <span className={`text-sm ${country?.label === c.label ? 'text-[#3d2f4d] font-bold' : 'text-warm-600 font-medium'}`}>
                                                        {c.label}
                                                    </span>

                                                </div>

                                                {country?.label === c.label && (<Check className="w-4 h-4 text-[#3d2f4d]" />
                                                )}

                                            </button>

                                        ))}

                                    </div>
                                </>
                            )}

                        </div>

                        {/* Bio / About */}

                        <div className="space-y-2.5">

                            <div className="flex items-center justify-between ml-1">

                                <Label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest">
                                    Short Bio
                                </Label>

                                <span className={`text-[10px] font-bold ${bio.length === 500 ? 'text-red-500' : 'text-warm-300'}`}>
                                    {bio.length}/500 </span>

                            </div>

                            <Textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value.substring(0, 500))}
                                placeholder="Introduce yourself to the community..."
                                className="min-h-[140px] bg-warm-50/50 border-warm-200 focus-visible:ring-warm-300 rounded-2xl text-base p-5 resize-none leading-relaxed font-medium shadow-sm transition-all"
                            />

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
