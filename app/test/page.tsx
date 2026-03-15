'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        async function fetch() {
            const { data, error } = await supabase.from('posts').select('*, user:users(name), community:communities(name)');
            if (error) setError(error);
            else setData(data);
        }
        fetch();
    }, []);

    return (
        <div className="p-10 bg-white min-h-screen text-black">
            <h1 className="text-2xl font-bold mb-4">Database Test</h1>
            {error && <pre className="bg-red-50 p-4 text-red-500">{JSON.stringify(error, null, 2)}</pre>}
            {!data && !error && <p>Loading...</p>}
            {data && (
                <div>
                    <p className="mb-4">Found {data.length} posts.</p>
                    <pre className="bg-gray-50 p-4">{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
