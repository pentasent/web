import { Metadata } from 'next';
import CommunityDetailView from '@/components/communities/CommunityDetailView';
import { CommunityDetailDTO, PublicCommunityDTO } from '@/types/communities';

interface CommunityDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getCommunityData(slug: string): Promise<{
  community: CommunityDetailDTO | null;
  allCommunities: PublicCommunityDTO[];
}> {
  const apiUrl = process.env.API_URL || 'http://localhost:5000/api/v1';
  try {
    const [detailRes, listRes] = await Promise.all([
      fetch(`${apiUrl}/communities/slug/${slug}`, { cache: 'no-store' }),
      fetch(`${apiUrl}/communities?limit=50`, { cache: 'no-store' }),
    ]);

    let community: CommunityDetailDTO | null = null;
    let allCommunities: PublicCommunityDTO[] = [];

    if (detailRes.ok) {
      const detailJson = await detailRes.json();
      if (detailJson.success && detailJson.data) {
        community = detailJson.data;
      }
    }

    if (listRes.ok) {
      const listJson = await listRes.json();
      if (listJson.success && listJson.data) {
        allCommunities = listJson.data;
      }
    }

    return { community, allCommunities };
  } catch (err) {
    console.warn(`Could not load community ${slug} server data:`, err);
    return { community: null, allCommunities: [] };
  }
}

export async function generateMetadata({
  params,
}: CommunityDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { community } = await getCommunityData(slug);

  if (!community) {
    return {
      title: 'Healthcare Community | Pentasent',
    };
  }

  return {
    title: `${community.name} - ${community.tagline || 'Clinical Community Circle'} | Pentasent`,
    description: community.description?.slice(0, 160) || community.tagline,
    openGraph: {
      title: `${community.name} | Pentasent Healthcare Communities`,
      description: community.tagline || community.description,
      url: `https://pentasent.com/communities/${community.slug}`,
      images: community.bannerUrl
        ? [{ url: community.bannerUrl }]
        : community.iconUrl
          ? [{ url: community.iconUrl }]
          : [],
      type: 'website',
    },
  };
}

export default async function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { slug } = await params;
  const { community, allCommunities } = await getCommunityData(slug);

  return (
    <main className="min-h-screen bg-white text-foreground">
      <CommunityDetailView
        slug={slug}
        initialCommunity={community}
        initialAllCommunities={allCommunities}
      />
    </main>
  );
}
