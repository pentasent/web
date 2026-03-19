'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function PostRedirectPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    useEffect(() => {
        if (postId) {
            router.replace(`/app/feed?post=${postId}`);
        } else {
            router.replace('/app/feed');
        }
    }, [postId, router]);

    return (
        <div className="min-h-screen bg-[#fffbf7] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#3c2a34] border-t-transparent rounded-full animate-spin" />
                <p className="text-warm-600 font-medium">Redirecting you to the post...</p>
            </div>
        </div>
    );
}
