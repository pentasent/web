import React from 'react';
import { Metadata } from 'next';
import ProductDetailView from '@/components/products/ProductDetailView';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.pentasent.com/api/v1';
    const res = await fetch(`${apiUrl}/products/slug/${slug}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn(`Could not load product ${slug} for metadata:`, err);
  }
  return null;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Healthcare Product | Pentasent',
    };
  }

  return {
    title: `${product.name} - ${product.tagline} | Pentasent Products`,
    description: product.description?.slice(0, 160) || product.tagline,
    openGraph: {
      title: `${product.name} | Pentasent Healthcare Innovation`,
      description: product.tagline,
      url: `https://pentasent.com/products/${product.slug}`,
      images: product.logoUrl ? [{ url: product.logoUrl }] : [],
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  return (
    <main className="min-h-screen bg-white">
      <section className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ProductDetailView slug={slug} initialProduct={product} />
        </div>
      </section>
    </main>
  );
}
