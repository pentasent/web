import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { JOB_OPENINGS, CANDIDATE_SAFETY_BANNER } from '@/data/jobs';
import type { JobDetailPageProps, JobOpening } from '@/types/jobs';
import JobDetailView from '@/components/pages/careers/open-roles/JobDetailView';

export const revalidate = 60;

export async function generateStaticParams() {
  return JOB_OPENINGS.map((job) => ({
    slug: job.slug,
  }));
}

async function getJob(slug: string): Promise<JobOpening | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.pentasent.com/api/v1';
    const res = await fetch(`${apiUrl}/jobs/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn(`Could not load job ${slug} from backend:`, err);
  }
  return JOB_OPENINGS.find((j) => j.slug === slug) || null;
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    return {
      title: 'Job Not Found | Pentasent Careers',
    };
  }

  return {
    title: `${job.title} | Pentasent Careers`,
    description: job.summary,
    openGraph: {
      title: `${job.title} - ${job.department} at Pentasent`,
      description: job.summary,
      url: `https://pentasent.com/company/careers/open-roles/${job.slug}`,
      type: 'website',
    },
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Top Candidate Safety Banner in bg-border-background */}
      <div className="w-full bg-border-background border-b border-[#e5e0dc] py-3 px-4 text-center">
        <p className="text-[13px] sm:text-[14px] font-medium text-[#2f0036] max-w-5xl mx-auto">
          {CANDIDATE_SAFETY_BANNER.prefix}
          <span className="font-semibold text-foreground">{CANDIDATE_SAFETY_BANNER.domain}</span>
          {CANDIDATE_SAFETY_BANNER.suffix}
        </p>
      </div>

      {/* Main Content Area */}
      <section className="w-full py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <JobDetailView job={job} />
        </div>
      </section>
    </main>
  );
}
