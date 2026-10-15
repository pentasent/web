'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Sparkles,
  Globe,
  ArrowRight,
  Tag,
} from 'lucide-react';
import { PublicProductDTO } from '@/types/products';
import { apiClient } from '@/lib/api';
import { getCachedProductBySlug, setCachedProductDetail } from '@/lib/products-cache';
import { ProductDetailShimmer } from '@/shimmer/tracker';
import ProductHero from '@/components/products/ProductHero';
import ProductGallery from '@/components/products/ProductGallery';
import ProductReviews from '@/components/products/ProductReviews';
import ProductDiscussions from '@/components/products/ProductDiscussions';

interface ProductDetailViewProps {
  slug: string;
  initialProduct?: PublicProductDTO | null;
}

export default function ProductDetailView({ slug, initialProduct }: ProductDetailViewProps) {
  // Check if we have cached detail or preview
  const cached = getCachedProductBySlug(slug);

  const [product, setProduct] = useState<PublicProductDTO | null>(() => {
    if (initialProduct) return initialProduct;
    if (cached?.full) return cached.full;
    if (cached?.preview) {
      // Synthesize a lightweight preview so Hero and breadcrumb can display instantly
      const p = cached.preview;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        tagline: p.tagline,
        description: '',
        websiteUrl: p.websiteUrl || '#',
        logoUrl: p.logoUrl,
        pricingModel: p.pricingModel,
        status: 'published',
        launchDate: p.launchDate,
        launchStatus: p.launchStatus,
        launchVersion: p.launchVersion,
        companyNameSnapshot: p.companyName,
        isFeatured: p.isFeatured,
        isVerified: p.isVerified,
        upvoteCount: p.upvoteCount,
        followerCount: p.followerCount,
        averageRating: p.averageRating,
        reviewCount: p.reviewCount,
        recommendationPercentage: p.recommendationPercentage,
        primaryCategory: p.primaryCategory,
        createdAt: p.createdAt,
        updatedAt: p.createdAt,
      } as PublicProductDTO;
    }
    return null;
  });

  const [isFullLoaded, setIsFullLoaded] = useState<boolean>(() => {
    return Boolean(initialProduct || cached?.full);
  });
  const [notFoundState, setNotFoundState] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    // Cache initial if provided
    if (initialProduct) {
      setCachedProductDetail(slug, initialProduct);
      return;
    }

    // Fetch full fresh product details
    apiClient<PublicProductDTO>(`/products/slug/${slug}`)
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data) {
          setProduct(res.data);
          setIsFullLoaded(true);
          setCachedProductDetail(slug, res.data);
        } else {
          if (!product) {
            setNotFoundState(true);
          }
        }
      })
      .catch(() => {
        if (!isMounted) return;
        if (!product) {
          setNotFoundState(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug, initialProduct]);

  // If no initial product and no cached preview, render shimmer until data arrives
  if (!product && !notFoundState) {
    return <ProductDetailShimmer />;
  }

  // Not found fallback
  if (notFoundState || !product) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-[26px] font-bold text-foreground">Product Not Found</h2>
        <p className="text-[15px] text-primary-text max-w-md mx-auto">
          The product you are looking for may have been removed or does not exist.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[14px] font-bold transition-colors cursor-pointer"
          >
            <span>Explore Products</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const descriptionParagraphs = (product.description || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-[13px] sm:text-[14px] text-primary-text">
          <li>
            <Link href="/" className="hover:text-primary transition-colors cursor-pointer">
              Home
            </Link>
          </li>
          <li className="flex items-center text-primary-text/40">
            <ChevronRight size={14} />
          </li>
          <li>
            <Link href="/products" className="hover:text-primary transition-colors cursor-pointer">
              Products
            </Link>
          </li>
          <li className="flex items-center text-primary-text/40">
            <ChevronRight size={14} />
          </li>
          <li className="font-semibold text-foreground truncate max-w-56 sm:max-w-xs">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Product Hero Header */}
      <ProductHero product={product} />

      {/* Main Divider */}
      <div className="border-t border-[#e8e4e1] my-8 sm:my-10" />

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column (8 cols): Deep details flow */}
        <div className="lg:col-span-8 space-y-10 sm:space-y-12">
          {/* Gallery Section */}
          {isFullLoaded && product.screenshots && product.screenshots.length > 0 && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Interface &amp; Workflow
              </span>
              <h2 className="mt-1.5 mb-4 text-[24px] sm:text-[28px] font-bold text-foreground tracking-tight">
                Product Gallery
              </h2>
              <ProductGallery
                screenshots={product.screenshots}
                productName={product.name}
              />
            </div>
          )}

          {/* Section 1: Overview & About */}
          {descriptionParagraphs.length > 0 ? (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Product Overview
              </span>
              <h2 className="mt-1.5 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                About {product.name}
              </h2>
              <div className="mt-4 space-y-3.5 text-[15px] sm:text-[16px] leading-[1.75] text-primary-text">
                {descriptionParagraphs.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </div>
            </div>
          ) : !isFullLoaded ? (
            <div className="space-y-3">
              <div className="h-4 w-28 rounded bg-[#faf8f6] animate-shimmer" />
              <div className="h-7 w-48 rounded bg-[#faf8f6] animate-shimmer" />
              <div className="h-4 w-full rounded bg-[#faf8f6] animate-shimmer" />
              <div className="h-4 w-5/6 rounded bg-[#faf8f6] animate-shimmer" />
            </div>
          ) : null}

          {/* Section 2: Problem Solved & Target Audience (Unboxed, clean with minimal dividers) */}
          {(product.problemSolved || product.targetAudience) && (
            <div className="space-y-8 pt-2">
              {product.problemSolved && (
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                      Problem Addressed
                    </span>
                  </div>
                  <h3 className="text-[20px] sm:text-[22px] font-bold text-foreground tracking-tight">
                    Why this was built
                  </h3>
                  <p className="mt-3 text-[15px] sm:text-[16px] leading-[1.75] text-primary-text">
                    {product.problemSolved}
                  </p>
                </div>
              )}

              {product.problemSolved && product.targetAudience && (
                <div className="border-t border-[#e8e4e1] my-6" />
              )}

              {product.targetAudience && (
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-emerald-800">
                      Target Audience
                    </span>
                  </div>
                  <h3 className="text-[20px] sm:text-[22px] font-bold text-foreground tracking-tight">
                    Who benefits from this solution
                  </h3>
                  <p className="mt-3 text-[15px] sm:text-[16px] leading-[1.75] text-primary-text">
                    {product.targetAudience}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Section 3: Key Features (Minimal checkmark list matching JobDetailView) */}
          {product.features && product.features.length > 0 && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Core Capabilities
              </span>
              <h2 className="mt-1.5 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                Key Features
              </h2>
              <ul className="mt-5 space-y-4">
                {product.features.map((feature, index) => (
                  <li key={feature.id || index} className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 size={13} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-[16px] sm:text-[17px] font-bold text-foreground">
                        {feature.title}
                      </h4>
                      {feature.description && (
                        <p className="text-[14.5px] sm:text-[15.5px] leading-[1.65] text-primary-text">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 4: Pricing Plans (Cards with max rounded-xl) */}
          {product.pricingPlans && product.pricingPlans.length > 0 && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Investment &amp; Licensing
              </span>
              <h2 className="mt-1.5 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                Pricing Plans
              </h2>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-5 rounded-xl border transition-all ${
                      plan.isBest
                        ? 'bg-[#faf9f8] border-primary shadow-xs'
                        : 'bg-white border-[#ded9d5]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-[17px] font-bold text-foreground">
                        {plan.name}
                      </h4>
                      {plan.isBest && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#f4ddf0] text-primary">
                          Best Value
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-baseline gap-1">
                      {plan.isFree ? (
                        <span className="text-[24px] font-bold text-foreground">Free</span>
                      ) : plan.amountMinor !== null && plan.amountMinor !== undefined ? (
                        <>
                          <span className="text-[24px] font-bold text-foreground">
                            ${(plan.amountMinor / 100).toFixed(0)}
                          </span>
                          {plan.billingPeriod && (
                            <span className="text-[13px] text-muted-foreground">
                              / {plan.billingPeriod}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[18px] font-semibold text-foreground">Contact</span>
                      )}
                    </div>

                    {plan.description && (
                      <p className="mt-2 text-[13.5px] sm:text-[15.5px] md:text-[14.5px] lg:text-[15.5px] leading-relaxed text-primary-text">
                        {plan.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Makers & Launch Team */}
          {product.makers && product.makers.length > 0 && (
            <div>
              <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Product Team
              </span>
              <h2 className="mt-1.5 text-[24px] sm:text-[28px] font-bold leading-[1.2] tracking-tight text-foreground">
                Makers &amp; Contributors
              </h2>
              <div className="mt-5 flex flex-wrap gap-4">
                {product.makers.map((maker) => (
                  <div
                    key={maker.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#faf9f8] border border-[#ded9d5]"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary/10 text-primary flex items-center justify-center font-bold text-[14px]">
                      {maker.avatarUrl ? (
                        <Image
                          src={maker.avatarUrl}
                          alt={maker.displayName}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        maker.displayName.charAt(0)
                      )}
                    </div>
                    <div>
                      <span className="block text-[14px] font-bold text-foreground">
                        {maker.displayName}
                      </span>
                      <span className="block text-[12px] text-muted-foreground">
                        {maker.roleTitle || 'Maker'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags List */}
          {product.tags && product.tags.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <Tag size={14} className="text-muted-foreground mr-1" />
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-[#faf9f8] border border-[#ded9d5] text-[12px] font-medium text-primary-text"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider before reviews */}
          <div className="border-t border-[#e8e4e1] my-8 sm:my-10" />

          {/* Section 6: Verified Reviews */}
          {isFullLoaded ? (
            <ProductReviews
              productId={product.id}
              reviews={product.reviews || []}
              averageRating={product.averageRating}
              reviewCount={product.reviewCount}
              recommendationPercentage={product.recommendationPercentage}
              canReview={product.viewerState?.canReview ?? true}
              initialUserReview={product.viewerState?.userReview}
              isOwner={product.viewerState?.isOwner}
            />
          ) : (
            <div className="space-y-4">
              <div className="h-6 w-36 rounded bg-[#faf8f6] animate-shimmer" />
              <div className="h-20 w-full rounded-xl bg-[#faf8f6] animate-shimmer border border-[#f0ece9]" />
            </div>
          )}

          {/* Divider before discussions */}
          <div className="border-t border-[#e8e4e1] my-8 sm:my-10" />

          {/* Section 7: Community Discussions / Q&A */}
          {isFullLoaded ? (
            <ProductDiscussions
              productId={product.id}
              comments={product.comments || []}
            />
          ) : (
            <div className="space-y-4">
              <div className="h-6 w-44 rounded bg-[#faf8f6] animate-shimmer" />
              <div className="h-24 w-full rounded-xl bg-[#faf8f6] animate-shimmer border border-[#f0ece9]" />
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Sticky Sidebar (Unboxed minimal style) */}
        <aside className="lg:col-span-4 border-t border-[#e8e4e1] pt-10 lg:border-0 lg:pt-0">
          <div className="sticky top-24 divide-y divide-[#e8e4e1]">
            {/* Quick Info (Clean, unboxed specs with simple divider lines) */}
            <div className="pb-8 space-y-5">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                  Product Details
                </span>
                <h3 className="mt-1 text-[20px] font-bold text-foreground">
                  Overview Specs
                </h3>
              </div>

              <div className="divide-y divide-[#f0ece9] text-[14px]">
                <div className="pb-3">
                  <span className="block text-[11.5px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Primary Category
                  </span>
                  <span className="font-semibold text-foreground">
                    {product.primaryCategory?.name || 'Healthcare'}
                  </span>
                </div>

                <div className="py-3">
                  <span className="block text-[11.5px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Pricing Model
                  </span>
                  <span className="font-semibold text-foreground capitalize">
                    {product.pricingModel.replace(/_/g, ' ')}
                  </span>
                </div>

                {product.launchDate && (
                  <div className="py-3">
                    <span className="block text-[11.5px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Launch Date
                    </span>
                    <span className="font-medium text-foreground">
                      {product.launchDate}
                    </span>
                  </div>
                )}

                {product.launchVersion && (
                  <div className="py-3">
                    <span className="block text-[11.5px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Current Version
                    </span>
                    <span className="font-medium text-foreground">
                      {product.launchVersion}
                    </span>
                  </div>
                )}

                <div className="pt-3">
                  <span className="block text-[11.5px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Verification Status
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <ShieldCheck size={14} />
                    {product.isVerified ? 'Verified Platform Listing' : 'Community Submission'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e8e4e1]">
                <a
                  href={product.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white text-[14px] font-bold transition-all shadow-xs cursor-pointer"
                >
                  <span>Visit Official Website</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Company Information (Unboxed section) */}
            {product.companyNameSnapshot && (
              <div className="py-8 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Building2 size={18} />
                  <h4 className="text-[16px] font-bold text-foreground">
                    Organization
                  </h4>
                </div>
                <span className="block text-[15px] font-bold text-foreground">
                  {product.companyNameSnapshot}
                </span>
                {product.companyDescriptionSnapshot && (
                  <p className="text-[13.5px] sm:text-[15.5px] md:text-[14.5px] lg:text-[15.5px] leading-relaxed text-primary-text">
                    {product.companyDescriptionSnapshot}
                  </p>
                )}
              </div>
            )}

            {/* Social Links (Unboxed section) */}
            {product.socialLinks && product.socialLinks.length > 0 && (
              <div className="py-8 space-y-3">
                <h4 className="text-[15px] font-bold text-foreground">
                  Connect &amp; Follow
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {product.socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ded9d5] bg-white hover:bg-[#faf9f8] text-[13px] font-medium text-foreground transition-colors"
                    >
                      <Globe size={13} className="text-primary" />
                      <span className="capitalize">{link.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Callout (Unboxed section) */}
            <div className="py-8 space-y-3">
              <div className="flex items-center gap-1.5 text-primary text-[12px] font-bold uppercase tracking-wider">
                <Sparkles size={12} />
                <span>Have a Healthtech Tool?</span>
              </div>
              <h4 className="text-[17px] font-bold text-foreground">
                Showcase Your Solution
              </h4>
              <p className="text-[13.5px] sm:text-[15.5px] md:text-[14.5px] lg:text-[15.5px] leading-relaxed text-primary-text">
                Join hundreds of digital health innovators showcasing tools to clinicians worldwide.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-primary hover:underline"
              >
                <span>Explore more products</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
