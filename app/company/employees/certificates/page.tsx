import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import CertificateView from './CertificateView';

export const dynamic = 'force-dynamic';

export default async function CertificatePage({
    searchParams,
}: {
    searchParams: { id?: string };
}) {
    const certificateId = searchParams.id;

    // If someone tries to access only url no id, redirect to home page.
    if (!certificateId) {
        redirect('/');
    }

    try {
        // Fetch from Supabase certificates table
        const { data: certificate, error } = await supabase
            .from('certificates')
            .select('*')
            .eq('certificate_id', certificateId)
            .maybeSingle();

        if (error) {
            console.error('Supabase query error:', error);
            return (
                <CertificateView 
                    certificate={null} 
                    certificateId={certificateId} 
                />
            );
        }

        return (
            <CertificateView 
                certificate={certificate || null} 
                certificateId={certificateId} 
            />
        );
    } catch (err) {
        console.error('Server error fetching certificate:', err);
        return (
            <CertificateView 
                certificate={null} 
                certificateId={certificateId} 
            />
        );
    }
}
