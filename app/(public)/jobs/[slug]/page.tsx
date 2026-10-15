import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { JOB_OPENINGS } from '@/data/jobs';
import type { JobDetailPageProps, JobOpening } from '@/types/jobs';
import JobDetailView from '@/components/pages/careers/open-roles/JobDetailView';

async function getJob(slug: string): Promise<JobOpening | null> {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${apiUrl}/jobs/slug/${slug}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn(`Could not load global job ${slug} from backend:`, err);
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
      title: 'Job Not Found | Pentasent Healthcare Jobs',
    };
  }

  const employer = job.employerName || 'Healthcare Network';

  return {
    title: `${job.title} at ${employer} | Pentasent Jobs`,
    description: job.summary,
    openGraph: {
      title: `${job.title} - ${job.department} at ${employer}`,
      description: job.summary,
      url: `https://pentasent.com/jobs/${job.slug}`,
      type: 'website',
    },
  };
}

export default async function GlobalJobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Main Content Area */}
      <section className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <JobDetailView job={job} basePath="/jobs" />
        </div>
      </section>
    </main>
  );
}
