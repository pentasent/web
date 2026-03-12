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

const COUNTRIES = [
    { label: 'United States', flag: '🇺🇸' },
    { label: 'United Kingdom', flag: '🇬🇧' },
    { label: 'India', flag: '🇮🇳' },
    { label: 'Canada', flag: '🇨🇦' },
    { label: 'Australia', flag: '🇦🇺' },
    { label: 'Germany', flag: '🇩🇪' },
    { label: 'France', flag: '🇫🇷' },
    { label: 'Japan', flag: '🇯🇵' },
    { label: 'Brazil', flag: '🇧🇷' },
    { label: 'South Africa', flag: '🇿🇦' },
];

export default function EditProfilePage() {
    const { user, loading: authLoading, refreshUser } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [country, setCountry] = useState<{ label: string; flag: string } | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/signin');
        } else if (user) {
            setName(user.name || '');
            setBio(user.bio || '');
            if (user.country) {
                const found = COUNTRIES.find(c => c.label === user.country);
                setCountry(found || { label: user.country, flag: '🌍' });
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
                description: "File should not be more than 10 MB.",
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

                if (uploadError) {
                    console.error('Upload Error:', uploadError);
                    throw new Error('Failed to upload avatar.');
                }

                const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
                finalAvatarUrl = publicUrlData.publicUrl;
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
            console.error("Save Error:", error);
            toast({
                title: "Update Failed",
                description: error.message || "Failed to update profile.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-warm-700" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 bg-warm-50/50">
            <div className="max-w-[800px] mx-auto w-full flex flex-col mt-24 xl:mt-12 px-4 md:px-0">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-10 px-2">
                    <div className="flex items-center gap-6">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => router.back()}
                            className="h-12 w-12 rounded-2xl hover:bg-warm-100 border border-warm-200/50 bg-white shadow-sm transition-all"
                        >
                            <ArrowLeft className="h-5 w-5 text-warm-700" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-warm-900 font-serif tracking-tight">Edit Profile</h1>
                            <p className="text-warm-500 text-sm font-medium mt-1">Customize your public presence</p>
                        </div>
                    </div>
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="bg-[#3d2f4d] hover:bg-[#2a2035] text-white rounded-2xl px-10 h-12 shadow-lg shadow-warm-900/10 transition-all active:scale-95 text-base font-semibold"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-warm-200/60">
                    
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center mb-12">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="p-1 border-[4px] border-[#F8F2EE] rounded-[3rem] bg-white shadow-xl">
                                <Avatar className="h-32 w-32 sm:h-40 sm:w-40 rounded-[2.5rem] border-none">
                                    <AvatarImage src={avatarUrl || "https://api.pentasent.com/storage/v1/object/public/avatars/placeholders/icon.png"} alt="Avatar" className="object-cover" />
                                    <AvatarFallback className="text-4xl bg-warm-100 text-warm-800 font-serif">
                                        {name.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="absolute inset-2 bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="h-10 w-10 text-white" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-[#3d2f4d] w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-[4px] border-white text-white">
                                <Camera className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-warm-500 text-sm mt-6 font-bold uppercase tracking-widest cursor-pointer hover:text-warm-800 transition-colors" onClick={() => fileInputRef.current?.click()}>
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
                    <div className="space-y-8 max-w-xl mx-auto">
                        <div className="space-y-3">
                            <Label htmlFor="name" className="text-warm-800 font-bold uppercase tracking-wider text-[10px] ml-1">Full Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="How should we call you?"
                                className="bg-warm-50/30 border-warm-200 focus-visible:ring-warm-400 h-14 rounded-2xl text-base px-5 font-medium shadow-inner"
                            />
                        </div>

                        <div className="space-y-3 relative">
                            <Label className="text-warm-800 font-bold uppercase tracking-wider text-[10px] ml-1">Location / Country</Label>
                            <button
                                type="button"
                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                className="w-full flex items-center justify-between bg-warm-50/30 border border-warm-200 h-14 rounded-2xl px-5 text-left focus:outline-none focus:ring-2 focus:ring-warm-400/50 transition-all shadow-inner"
                            >
                                <span className={`text-base font-medium ${country ? 'text-warm-900' : 'text-warm-400'}`}>
                                    {country ? `${country.flag} ${country.label}` : 'Select your country'}
                                </span>
                                <ChevronDown className="h-5 w-5 text-warm-400" />
                            </button>

                            {showCountryDropdown && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setShowCountryDropdown(false)} 
                                    />
                                    <div className="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto bg-white border border-warm-200 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in duration-200">
                                        {COUNTRIES.map((c) => (
                                            <button
                                                key={c.label}
                                                type="button"
                                                onClick={() => {
                                                    setCountry(c);
                                                    setShowCountryDropdown(false);
                                                }}
                                                className="w-full flex items-center px-5 py-4 hover:bg-warm-50 transition-colors text-left"
                                            >
                                                <span className="text-2xl mr-4">{c.flag}</span>
                                                <span className="text-warm-900 font-bold flex-1">{c.label}</span>
                                                {country?.label === c.label && (
                                                    <div className="bg-warm-100 p-1.5 rounded-full">
                                                        <Check className="h-4 w-4 text-warm-700" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="bio" className="text-warm-800 font-bold uppercase tracking-wider text-[10px]">Short Bio</Label>
                                <span className={`text-[10px] font-bold tracking-tight ${bio.length > 500 ? 'text-red-500' : 'text-warm-400'}`}>
                                    {bio.length} / 500
                                </span>
                            </div>
                            <Textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value.substring(0, 500))}
                                placeholder="Introduce yourself to the community... (20+ characters)"
                                className="bg-warm-50/30 border-warm-200 focus-visible:ring-warm-400 min-h-[160px] rounded-2xl text-base p-5 resize-none leading-relaxed font-medium shadow-inner"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
