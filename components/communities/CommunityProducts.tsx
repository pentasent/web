'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PackageSearch, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { ProductCardDTO } from '@/types/products';
import { apiClient } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';

interface CommunityProductsProps {
  communityId: string;
  communityName: string;
}

export default function CommunityProducts({
  communityId,
  communityName,
}: CommunityProductsProps) {
  const [products, setProducts] = useState<ProductCardDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient<ProductCardDTO[]>(`/communities/${communityId}/products`);
        if (isMounted && res.success && res.data) {
          setProducts(res.data);
        }
      } catch (err) {
        console.warn('Error fetching community products:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [communityId]);

  return (
    <div className="space-y-4">
      {/* Products Header Card */}
      <div className="rounded-none sm:rounded-lg border-x-0 border-t-0 sm:border border-b border-[#ded5cd] bg-white p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b185f]">
            Circle Marketplace
          </span>
          <span className="text-[#c5bbb2]">·</span>
          <span className="text-[11.5px] font-semibold text-primary">
            Clinical Solutions
          </span>
        </div>
        <h2 className="mt-1 text-[18px] sm:text-[22px] font-bold text-foreground">
          Products Linked to {communityName}
        </h2>
        <p className="mt-1 text-[13px] md:text-[14px] lg:text-[15px] text-primary-text leading-relaxed">
          Specialized diagnostic devices, digital health software, and clinical therapeutics verified on Pentasent and recommended for this circle.
        </p>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="rounded-none sm:rounded-lg border-x-0 border-t-0 sm:border border-b border-[#ded5cd] bg-white divide-y divide-[#ded5cd] overflow-hidden">
          {[1, 2].map((idx) => (
            <div key={idx} className="p-4 sm:p-5 flex items-start gap-4">
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#faf8f6] animate-shimmer shrink-0" />
                <div className="sm:hidden w-14 h-11 rounded-lg bg-[#faf8f6] animate-shimmer border border-[#f0ece9]" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded bg-[#faf8f6] animate-shimmer" />
                <div className="h-3.5 w-3/4 rounded bg-[#faf8f6] animate-shimmer" />
                <div className="h-3 w-1/3 rounded bg-[#faf8f6] animate-shimmer" />
              </div>
              <div className="hidden sm:flex shrink-0 self-center flex-col items-center justify-center sm:min-w-[58px] sm:h-16 rounded-lg bg-[#faf8f6] animate-shimmer border border-[#f0ece9]" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        /* Populated Products List (Same ProductCard as /products page) */
        <div className="rounded-none sm:rounded-lg border-x-0 border-t-0 sm:border border-b border-[#ded5cd] bg-white divide-y divide-[#ded5cd] overflow-hidden p-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              basePath="/products"
              index={index}
              onUpvoteChange={(id, newCount, hasUpvoted) => {
                setProducts((prev) =>
                  prev.map((p) =>
                    p.id === id ? { ...p, upvoteCount: newCount, hasUpvoted } : p
                  )
                );
              }}
            />
          ))}
        </div>
      ) : (
        /* Empty State Card: No products linked to this community */
        <div className="py-12 sm:py-16 text-center rounded-none sm:rounded-lg border-x-0 border-t-0 sm:border border-b border-[#ded5cd] bg-white p-6 sm:p-12">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <PackageSearch size={22} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles size={12} />
            <span>Directory Link</span>
          </div>
          <h3 className="text-[17px] sm:text-[18px] font-bold text-foreground">
            No Products Linked to This Circle Yet
          </h3>
          <p className="mt-2 text-[13px] md:text-[14px] lg:text-[15px] text-primary-text max-w-md mx-auto leading-relaxed">
            There are currently no certified clinical products or software solutions linked directly to <strong>{communityName}</strong>.
          </p>
          <div className="mt-5 flex justify-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <span>Explore All Verified Products</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
