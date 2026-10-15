import React from 'react';
import { Metadata } from 'next';
import EventDetailView from '@/components/events/EventDetailView';

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getEvent(idOrSlug: string) {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${apiUrl}/events/${idOrSlug}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn(`Could not load event ${idOrSlug} for metadata:`, err);
  }
  return null;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return {
      title: 'Healthcare Event | Pentasent',
    };
  }

  return {
    title: `${event.title} | Pentasent Events`,
    description: event.shortDescription || event.description?.slice(0, 160) || event.title,
    openGraph: {
      title: `${event.title} | Pentasent Healthcare Symposia`,
      description: event.shortDescription || event.title,
      url: `https://pentasent.com/events/${event.slug}`,
      images: event.bannerUrl ? [{ url: event.bannerUrl }] : [],
      type: 'website',
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  return (
    <main className="min-h-screen bg-white">
      <section className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <EventDetailView slug={id} initialEvent={event} />
        </div>
      </section>
    </main>
  );
}
