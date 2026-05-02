import { Metadata } from 'next';
import JobsForm from './JobsForm';

export const metadata: Metadata = {
    title: 'Jobs Screening Assignment | Pentasent',
    description: 'Join the Pentasent team. Complete our screening assignment to showcase your product thinking and help us build the future of wellness.',
    openGraph: {
        title: 'Jobs Screening Assignment | Pentasent',
        description: 'Join the Pentasent team. Complete our screening assignment to showcase your product thinking.',
        images: ['/images/office/main_office.svg', '/images/jobs_header_bg.png'],
    },
};

export default function JobsPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-50/50 to-white relative flex flex-col">
            {/* Background Blobs - fixed to prevent double scrollbar */}
            <div className="fixed inset-0 opacity-40 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-pink-100 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-100 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
            </div>

            <div className="relative z-10 w-full py-12 px-4">
                <JobsForm />
            </div>
        </main>
    );
}
