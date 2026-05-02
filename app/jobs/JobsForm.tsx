'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle2, 
    Loader2, 
    Smartphone, 
    Clock,
    AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function JobsForm() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        currentRole: '',
        experience: '',
        exploredApp: '',
        likes: '',
        improvement: '',
        scaling: '',
        issues: '',
        differentApproach: '',
        timeSpent: '',
        additionalNotes: ''
    });

    const [isFormValid, setIsFormValid] = useState(false);

    const [phoneError, setPhoneError] = useState('');

    useEffect(() => {
        const requiredFields = [
            'fullName', 'email', 'phone', 'location', 
            'currentRole', 'experience', 'exploredApp', 
            'likes', 'improvement', 'scaling', 'timeSpent'
        ];
        
        const isValid = requiredFields.every(field => {
            const value = formData[field as keyof typeof formData];
            return value && value.trim() !== '';
        });

        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
        
        // Phone Validation: Allow +, but check if digits are exactly 10 if no + or at least 10 if +
        const rawPhone = formData.phone.replace(/[\s-()]/g, '');
        const hasPlus = rawPhone.startsWith('+');
        const digitsOnly = hasPlus ? rawPhone.slice(1) : rawPhone;
        const isNumeric = /^\d+$/.test(digitsOnly);
        const isCorrectLength = digitsOnly.length === 10;
        
        const isPhoneValid = isNumeric && (hasPlus ? digitsOnly.length >= 10 : isCorrectLength);

        if (formData.phone && !isPhoneValid) {
            setPhoneError("Please enter a valid 10-digit phone number.");
        } else {
            setPhoneError('');
        }

        setIsFormValid(isValid && isEmailValid && isPhoneValid);
    }, [formData]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setLoading(true);
        
        try {
            const { error } = await supabase
                .from('job_responses')
                .insert({
                    full_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    location: formData.location,
                    role_title: formData.currentRole,
                    work_experience: formData.experience,
                    has_explored_app: formData.exploredApp === 'Yes',
                    liked_features: formData.likes,
                    feature_improvement: formData.improvement,
                    scalability_approach: formData.scaling,
                    issues_found: formData.issues || null,
                    build_differently: formData.differentApproach || null,
                    exploration_time: formData.timeSpent,
                    additional_notes: formData.additionalNotes || null,
                });

            if (error) throw error;

            setShowSuccess(true);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                location: '',
                currentRole: '',
                experience: '',
                exploredApp: '',
                likes: '',
                improvement: '',
                scaling: '',
                issues: '',
                differentApproach: '',
                timeSpent: '',
                additionalNotes: ''
            });
        } catch (error: any) {
            console.error('Submission error:', error);
            toast({
                title: "Submission failed",
                description: error.message || "Something went wrong while submitting your application. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "border-0 border-b border-gray-200 rounded-none px-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-[#3d253b] bg-transparent shadow-none appearance-none";

    return (
        <div className="w-full max-w-[770px] mx-auto space-y-4">
            
            {/* Google Form Style Banner */}
            <div className="w-full h-[180px] md:h-[220px] relative rounded-t-lg overflow-hidden border border-gray-200 border-b-0">
                <Image 
                    src="/images/office/main_office.svg" 
                    alt="Pentasent Banner" 
                    fill
                    className="object-cover object-top"
                    priority
                />
            </div>

            {/* Title & Info Card */}
            <Card className="border border-gray-200 border-t-[10px] border-t-[#3d253b] rounded-lg rounded-t-none shadow-none">
                <CardContent className="p-6 md:p-8 space-y-6">
                    <h1 className="text-3xl md:text-4xl font-normal text-[#3c2a34]" style={{ fontFamily: 'Georgia, serif' }}>
                        Pentasent Screening Assignment
                    </h1>
                    <div className="space-y-4 text-[15px] text-gray-700 leading-relaxed">
                        <p>
                            As part of this round, you&apos;ll explore specific modules in our Android app and answer a few focused questions.
                        </p>
                        <p>
                            This is a real product-thinking exercise, we&apos;re interested in how you approach systems, user experience, and product decisions.
                        </p>
                        <p className="font-semibold text-[#3d253b]">
                            Please ensure you explore the app before answering. Responses without proper exploration may not be considered.
                        </p>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Estimated time: 15–25 minutes</span>
                        </div>
                    </div>
                    
                    <hr className="border-gray-100" />
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-pink-50/30 p-4 rounded-lg border border-pink-100/50">
                        <div className="flex items-center gap-3">
                            <Smartphone className="w-6 h-6 text-[#3d253b]" />
                            <span className="text-sm font-medium text-[#3d253b]">Required before answering</span>
                        </div>
                        <Button asChild variant="outline" className="border-[#3d253b]/20 text-[#3d253b] hover:bg-[#3d253b]/5 rounded-md">
                            <Link href="https://play.google.com/store/apps/details?id=com.pentasent.app" target="_blank">
                                Get App
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Basic Information */}
                <Card className="border border-gray-200 rounded-lg shadow-none">
                    <CardContent className="p-6 md:p-8 space-y-8">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-base font-medium">Full Name <span className="text-red-500">*</span></Label>
                            <Input 
                                id="fullName" 
                                placeholder="Your answer" 
                                className={inputClasses}
                                value={formData.fullName}
                                onChange={(e) => handleChange('fullName', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-base font-medium">Email Address <span className="text-red-500">*</span></Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="Your email" 
                                className={inputClasses}
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-base font-medium">Phone Number <span className="text-red-500">*</span></Label>
                            <Input 
                                id="phone" 
                                type="tel" 
                                placeholder="Your answer" 
                                className={inputClasses}
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                required
                            />
                            {phoneError && (
                                <p className="text-[12px] text-red-500 mt-1">{phoneError}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-base font-medium">Current Location (City, State) <span className="text-red-500">*</span></Label>
                            <Input 
                                id="location" 
                                placeholder="Your answer" 
                                className={inputClasses}
                                value={formData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Professional Background */}
                <Card className="border border-gray-200 rounded-lg shadow-none">
                    <CardContent className="p-6 md:p-8 space-y-8">
                        <div className="space-y-2">
                            <Label htmlFor="currentRole" className="text-base font-medium">Current Role / Title <span className="text-red-500">*</span></Label>
                            <Input 
                                id="currentRole" 
                                placeholder="Your answer" 
                                className={inputClasses}
                                value={formData.currentRole}
                                onChange={(e) => handleChange('currentRole', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-4">
                            <Label className="text-base font-medium">Total Work Experience <span className="text-red-500">*</span></Label>
                            <RadioGroup 
                                value={formData.experience} 
                                onValueChange={(val) => handleChange('experience', val)}
                                className="space-y-3"
                            >
                                {['0–1 year', '1–3 years', '3+ years'].map((opt) => (
                                    <div key={opt} className="flex items-center space-x-3">
                                        <RadioGroupItem value={opt} id={`exp-${opt}`} className="text-[#3d253b] border-gray-300" />
                                        <Label htmlFor={`exp-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>

                {/* App Exploration Check */}
                <Card className="border border-gray-200 rounded-lg shadow-none overflow-hidden">
                    <CardContent className="p-6 md:p-8 space-y-6">
                        <div className="space-y-4">
                            <Label className="text-base font-medium">Have you explored the Pentasent Android app? <span className="text-red-500">*</span></Label>
                            <RadioGroup 
                                value={formData.exploredApp} 
                                onValueChange={(val) => handleChange('exploredApp', val)}
                                className="space-y-3"
                            >
                                {['Yes', 'No'].map((opt) => (
                                    <div key={opt} className="flex items-center space-x-3">
                                        <RadioGroupItem value={opt} id={`explore-${opt}`} className="text-[#3d253b] border-gray-300" />
                                        <Label htmlFor={`explore-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        
                        <AnimatePresence>
                            {formData.exploredApp === 'No' && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                                    <p className="text-sm text-amber-800">
                                        We highly recommend exploring the app before proceeding. This screening is based entirely on your findings within the app.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                {/* Product Thinking */}
                <Card className="border border-gray-200 rounded-lg shadow-none">
                    <CardContent className="p-6 md:p-8 space-y-8">
                        <div className="space-y-3">
                            <Label htmlFor="likes" className="text-base font-medium leading-relaxed">What are 2-3 things you liked about the app? <span className="text-red-500">*</span></Label>
                            <Textarea 
                                id="likes" 
                                placeholder="Your answer" 
                                className={`${inputClasses} min-h-[100px] resize-none`}
                                value={formData.likes}
                                onChange={(e) => handleChange('likes', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="improvement" className="text-base font-medium leading-relaxed">Pick any one feature from the app, and explain how would you improve or redesign it and why? <span className="text-red-500">*</span></Label>
                            <Textarea 
                                id="improvement" 
                                placeholder="Your answer" 
                                className={`${inputClasses} min-h-[100px] resize-none`}
                                value={formData.improvement}
                                onChange={(e) => handleChange('improvement', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="scaling" className="text-base font-medium leading-relaxed">How would you ensure this feature scales with more users? <span className="text-red-500">*</span></Label>
                            <Textarea 
                                id="scaling" 
                                placeholder="Your answer" 
                                className={`${inputClasses} min-h-[100px] resize-none`}
                                value={formData.scaling}
                                onChange={(e) => handleChange('scaling', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="issues" className="text-base font-medium leading-relaxed">Did you notice any issues (bugs, UX gaps, performance)?</Label>
                            <Textarea 
                                id="issues" 
                                placeholder="Your answer" 
                                className={`${inputClasses} min-h-[100px] resize-none`}
                                value={formData.issues}
                                onChange={(e) => handleChange('issues', e.target.value)}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="differentApproach" className="text-base font-medium leading-relaxed">If you were building this product from scratch, what would you do differently?</Label>
                            <Textarea 
                                id="differentApproach" 
                                placeholder="Your answer" 
                                className={`${inputClasses} min-h-[100px] resize-none`}
                                value={formData.differentApproach}
                                onChange={(e) => handleChange('differentApproach', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Effort Filter */}
                <Card className="border border-gray-200 rounded-lg shadow-none">
                    <CardContent className="p-6 md:p-8 space-y-4">
                        <Label className="text-base font-medium">How much time did you spend exploring the app? <span className="text-red-500">*</span></Label>
                        <RadioGroup 
                            value={formData.timeSpent} 
                            onValueChange={(val) => handleChange('timeSpent', val)}
                            className="space-y-3"
                        >
                            {['<10 mins', '10–20 mins', '20+ mins'].map((opt) => (
                                <div key={opt} className="flex items-center space-x-3">
                                    <RadioGroupItem value={opt} id={`time-${opt}`} className="text-[#3d253b] border-gray-300" />
                                    <Label htmlFor={`time-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* Final Thoughts */}
                <Card className="border border-gray-200 rounded-lg shadow-none">
                    <CardContent className="p-6 md:p-8 space-y-3">
                        <Label htmlFor="additionalNotes" className="text-base font-medium">Anything else you&apos;d like to share?</Label>
                        <Textarea 
                            id="additionalNotes" 
                            placeholder="Your answer" 
                            className={`${inputClasses} min-h-[100px] resize-none`}
                            value={formData.additionalNotes}
                            onChange={(e) => handleChange('additionalNotes', e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* Submit Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                    <Button 
                        type="submit" 
                        disabled={!isFormValid || loading}
                        className="w-full sm:w-[120px] bg-[#3d253b] hover:bg-[#2d1a2b] text-white rounded-md h-10 font-medium transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            'Submit'
                        )}
                    </Button>
                    {!isFormValid && (
                        <p className="text-xs text-gray-400">Please fill in all required fields.</p>
                    )}
                </div>

            </form>


            {/* Success Popup */}
            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-lg [&>button]:hidden">
                    <div className="bg-white p-8 text-center space-y-6">
                        <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-light text-[#3c2a34]" style={{ fontFamily: 'Georgia, serif' }}>Submission received</h2>
                            <p className="text-sm text-gray-600">
                                Thank you for completing the assignment. Our team will review your responses and get back to you soon.
                            </p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 text-xs text-purple-900 leading-relaxed text-left">
                            <p>
                                Submitting again will not be considered. Explore our app more in the meantime and share your findings and improvements at <span className="font-bold">careers@pentasent.com</span>
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button 
                                className="w-full bg-[#3d253b] hover:bg-[#2d1a2b] text-white rounded-md h-11"
                            >
                                <Link href="/">
                                    Return to Home
                                </Link>
                            </Button>
                            <Button 
                                asChild
                                variant="outline"
                                className="w-full border-[#3d253b]/20 text-[#3d253b] hover:bg-[#3d253b]/5 rounded-md h-11"
                            >
                                <Link href="https://play.google.com/store/apps/details?id=com.pentasent.app" target="_blank">
                                    Explore APP
                                </Link>
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
