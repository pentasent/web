'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  PackageSearch,
  PlusCircle
} from 'lucide-react';
import { ProductCardDTO, ProductCategoryItem } from '@/types/products';
import { apiClient } from '@/lib/api';
import { ProductsListShimmer, ProductCategoriesShimmer } from '@/shimmer/tracker';
import ProductCard from '@/components/products/ProductCard';
import ProductSubmitModal from '@/components/forms/ProductSubmitModal';
import { useAuth } from '@/context/auth-context';
import { notify } from '@/components/ui/toast';
import { getCachedProducts, setCachedProducts } from '@/lib/products-cache';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q') || searchParams.get('search') || '';
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All categories');
  const [selectedPricing, setSelectedPricing] = useState<string>('All pricing models');
  const [selectedSort, setSelectedSort] = useState<string>('most_upvoted');
  const [searchQuery, setSearchQuery] = useState<string>(qParam);

  const [prevQParam, setPrevQParam] = useState(qParam);
  if (prevQParam !== qParam) {
    setPrevQParam(qParam);
    setSearchQuery(qParam);
  }

  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const [products, setProducts] = useState<ProductCardDTO[]>(() => {
    const cached = getCachedProducts();
    return cached && cached.length > 0 ? cached : [];
  });
  const [categories, setCategories] = useState<ProductCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    const cached = getCachedProducts();
    return !(cached && cached.length > 0);
  });
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Fetch products & categories from live backend
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          apiClient<ProductCardDTO[]>('/products?limit=100&sort=most_upvoted'),
          apiClient<ProductCategoryItem[]>('/products/categories'),
        ]);

        if (!isMounted) return;

        if (prodRes.success && prodRes.data) {
          setProducts(prodRes.data);
          setCachedProducts(prodRes.data);
        }

        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.warn('Unable to load products directory:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsLoadingCategories(false);
        }
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const pricingModels = [
    'All pricing models',
    'Free to use',
    'Free trial',
    'Paid software',
  ];

  const sortOptions = [
    { label: 'Most Upvoted', value: 'most_upvoted' },
    { label: 'Newest Launches', value: 'newest' },
    { label: 'Highest Rated', value: 'highest_rated' },
    { label: 'Featured First', value: 'featured' },
  ];

  const categoryOptions = useMemo(() => {
    const names = categories.map((c) => c.name);
    return ['All categories', ...names];
  }, [categories]);

  const hasActiveAdvancedFilters =
    selectedCategory !== 'All categories' ||
    selectedPricing !== 'All pricing models' ||
    selectedSort !== 'most_upvoted';

  const isFiltered = searchQuery.trim() !== '' || hasActiveAdvancedFilters;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All categories');
    setSelectedPricing('All pricing models');
    setSelectedSort('most_upvoted');
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        // Category filter
        if (selectedCategory !== 'All categories') {
          if (
            prod.primaryCategory?.name?.toLowerCase() !==
            selectedCategory.toLowerCase()
          ) {
            return false;
          }
        }

        // Pricing filter
        if (selectedPricing !== 'All pricing models') {
          if (selectedPricing === 'Free to use' && prod.pricingModel !== 'free') return false;
          if (selectedPricing === 'Free trial' && prod.pricingModel !== 'paid_with_free_trial') return false;
          if (selectedPricing === 'Paid software' && prod.pricingModel !== 'paid') return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = prod.name.toLowerCase().includes(q);
          const matchesTagline = prod.tagline.toLowerCase().includes(q);
          const matchesCompany = prod.companyName?.toLowerCase().includes(q) || false;
          const matchesCat = prod.primaryCategory?.name?.toLowerCase().includes(q) || false;
          if (!matchesName && !matchesTagline && !matchesCompany && !matchesCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'most_upvoted') {
          return (b.upvoteCount || 0) - (a.upvoteCount || 0);
        }
        if (selectedSort === 'highest_rated') {
          return (b.averageRating || 0) - (a.averageRating || 0);
        }
        if (selectedSort === 'featured') {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
        }
        // default newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, selectedCategory, selectedPricing, selectedSort, searchQuery]);

  // Handle post success
  const handleProductCreated = () => {
    // Refetch live list and update cache
    apiClient<ProductCardDTO[]>('/products?limit=100&sort=most_upvoted')
      .then((res) => {
        if (res.success && res.data) {
          setProducts(res.data);
          setCachedProducts(res.data);
          notify.success('Product submitted successfully!');
        }
      })
      .catch(() => { });
  };

  const handleLaunchClick = () => {
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent('/products')}`);
      return;
    }
    setIsSubmitModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* HERO SECTION (Unboxed, matching Jobs Hero & Press Hero) */}
      <section className="relative w-full bg-[#180915] text-white pt-24 pb-36 sm:pt-32 sm:pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/pages/jobs/job_circle_bubble_banner.png"
            alt="Pentasent Products Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 mix-blend-screen"
          />
          <div className="absolute inset-x-0 h-full bg-linear-to-r from-black/60 via-secondary/60 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.055, filter: 'blur(18px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.12, duration: 1.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 xs:px-6 text-center"
        >
          <div className="mb-3 text-[13px] xs:text-[14px] sm:text-[15px] font-medium tracking-[0.06em] text-white/80">
            {/* <Sparkles size={13} className="text-[#ffd3f0]" /> */}
            <span>Healthcare Innovation Directory</span>
          </div>

          <h1 className="mt-2 text-[34px] xs:text-[40px] sm:text-[48px] lg:text-[54px] font-bold leading-[1.08] tracking-[-1px] text-white">
            Discover the <span className="text-[#ffd3f0]">Healthtech Products</span>
          </h1>

          <p className="mt-4 sm:mt-5 max-w-2xl lg:max-w-3xl text-[15px] sm:text-[17px] leading-[1.65] text-white/80">
            Explore verified clinical software, medical devices, computational diagnostics, and digital health tools shaping patient care.
          </p>

          {/* <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleLaunchClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white hover:bg-[#faf9f8] text-primary text-[14px] font-bold transition-all cursor-pointer shadow-lg"
            >
              <PlusCircle size={16} />
              <span>Submit a Product</span>
            </button>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-md border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-[14px] font-medium text-white transition-all cursor-pointer"
            >
              <span>Explore Clinical Calculators</span>
              <ArrowRight size={14} />
            </Link>
          </div> */}
        </motion.div>
      </section>

      {/* FILTER SEARCH BAR (Sticky or floating over hero, matching Jobs page) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative mx-auto -mt-20 w-full max-w-5xl px-4 xs:px-6 overflow-visible z-20"
      >
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-muted text-foreground text-left">
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {/* Search Input */}
            <div className="flex flex-col w-full">
              <label
                htmlFor="product-filter-search"
                className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
              >
                Search Healthtech Products
              </label>
              <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg transition-all focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                <input
                  id="product-filter-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. OncoVision, ECG monitor, FHIR bridge, Ambient AI..."
                  className="w-full h-full pl-3.5 pr-10 text-[14px] sm:text-[14.5px] text-foreground placeholder:text-primary-text/70 bg-transparent border-0 outline-none"
                />
                <Search
                  size={17}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-text"
                />
              </div>
            </div>

            {/* Desktop Filters: 3 columns */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-3 sm:gap-4 items-end">
              {/* Category */}
              <div className="flex flex-col">
                <label
                  htmlFor="filter-category"
                  className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                >
                  Category
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <select
                    id="filter-category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="flex flex-col">
                <label
                  htmlFor="filter-pricing"
                  className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                >
                  Pricing Model
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <select
                    id="filter-pricing"
                    value={selectedPricing}
                    onChange={(e) => setSelectedPricing(e.target.value)}
                    className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                  >
                    {pricingModels.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div className="flex flex-col">
                <label
                  htmlFor="filter-sort"
                  className="text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1.5"
                >
                  Sort By
                </label>
                <div className="relative w-full h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                  <select
                    id="filter-sort"
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-foreground bg-transparent border-0 outline-none cursor-pointer truncate"
                  >
                    {sortOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-text"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="sm:hidden flex items-center justify-between pt-0.5">
              <button
                type="button"
                onClick={() => setShowMobileFilters((prev) => !prev)}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <SlidersHorizontal size={15} className="text-primary" />
                <span>{showMobileFilters ? 'Hide Filters' : 'Filter & Sort'}</span>
                {hasActiveAdvancedFilters && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10.5px] font-bold bg-primary/10 text-primary">
                    Active
                  </span>
                )}
              </button>

              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Mobile Filters Dropdown */}
            {showMobileFilters && (
              <div className="sm:hidden grid grid-cols-1 gap-3 pt-2 border-t border-[#ded9d5]">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#ded9d5] bg-[#faf9f8] text-[13.5px]"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
                    Pricing
                  </label>
                  <select
                    value={selectedPricing}
                    onChange={(e) => setSelectedPricing(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#ded9d5] bg-[#faf9f8] text-[13.5px]"
                  >
                    {pricingModels.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
                    Sort
                  </label>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#ded9d5] bg-[#faf9f8] text-[13.5px]"
                  >
                    {sortOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* TWO-COLUMN MAIN CONTENT (Unboxed matching /jobs page) */}
      <section className="w-full py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT COLUMN: Main Product Directory List */}
          <div className="lg:col-span-8">
            {/* Header row: Count & active filter chips */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-2 border-b border-[#e8e4e1]">
              <div className="flex items-center gap-2">
                <span className="text-[15px] sm:text-[16px] font-bold text-foreground">
                  {isLoading ? 'Loading launches...' : `${filteredProducts.length} Verified Products`}
                </span>
                {isFiltered && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#f4ddf0] text-primary">
                    Filtered
                  </span>
                )}
              </div>

              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Reset filters</span>
                </button>
              )}
            </div>

            {/* List with Shimmer loading state */}
            {isLoading ? (
              <ProductsListShimmer />
            ) : (
              <AnimatePresence mode="wait">
                {filteredProducts.length > 0 ? (
                  <motion.div
                    key="products-directory-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="divide-y divide-[#e8e4e1]"
                  >
                    {filteredProducts.map((prod, index) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        basePath="/products"
                        index={index}
                        onUpvoteChange={(id, newCount, hasUpvoted) => {
                          setProducts((prev) =>
                            prev.map((p) =>
                              p.id === id
                                ? { ...p, upvoteCount: newCount, hasUpvoted }
                                : p
                            )
                          );
                        }}
                      />
                    ))}
                  </motion.div>
                ) : (
                  /* Empty State (Unboxed) */
                  <motion.div
                    key="products-empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-14 sm:py-20 text-center max-w-md mx-auto"
                  >
                    <div className="w-14 h-14 mx-auto rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center mb-4">
                      <PackageSearch size={26} />
                    </div>
                    <h3 className="text-[20px] font-bold text-foreground">
                      No matching products found
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-primary-text">
                      Try clearing search terms or selecting a different healthcare category.
                    </p>
                    <div className="mt-5 flex justify-center">
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-white text-[13.5px] font-bold hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        <span>Reset all filters</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar (Clean, Unboxed with Dividers) */}
          <div className="lg:col-span-4 divide-y divide-[#e8e4e1]">
            {/* Submit Product Callout */}
            <div className="pb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#f4ddf0] text-primary">
                  <Sparkles size={11} />
                  Launch Your Innovation
                </span>
              </div>
              <h3 className="text-[19px] font-bold text-foreground">
                Building for Healthcare?
              </h3>
              <p className="mt-2 text-[14px] sm:text-[15px] leading-relaxed text-primary-text">
                Showcase your clinical AI model, digital health platform, medical device, or health data API to verified clinicians, hospitals, and investors.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleLaunchClick}
                  className="w-full inline-flex items-center justify-center gap-2 rounded bg-primary hover:bg-primary-hover px-5 py-3 text-[14px] font-bold text-white transition-all cursor-pointer shadow-xs"
                >
                  <PlusCircle size={16} />
                  <span>Submit a Healthcare Product</span>
                </button>
              </div>
            </div>

            {/* Top Categories Quick Links */}
            <div className="py-8">
              <h3 className="text-[17px] font-bold text-foreground mb-3">
                Popular Categories
              </h3>
              {isLoadingCategories && categories.length === 0 ? (
                <ProductCategoriesShimmer />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 8).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors cursor-pointer ${selectedCategory === cat.name
                          ? 'bg-primary text-white border-primary font-bold'
                          : 'bg-[#faf9f8] hover:bg-white text-primary-text hover:text-foreground border-[#ded9d5]'
                        }`}
                    >
                      <span>{cat.name}</span>
                      {cat.productCount && cat.productCount > 0 ? (
                        <span className={`text-[11px] ${selectedCategory === cat.name ? 'text-white/80' : 'text-muted-foreground'}`}>
                          ({cat.productCount})
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Why Pentasent Directory */}
            <div className="py-8">
              <div className="flex items-center gap-2 text-primary mb-2">
                <ShieldCheck size={18} />
                <h3 className="text-[17px] font-bold text-foreground">
                  Clinical Quality Standard
                </h3>
              </div>
              <p className="text-[14px] sm:text-[15px] leading-relaxed text-primary-text">
                Unlike generic product hunts, Pentasent requires medical taxonomy tagging, clinical audience segmentation, and verified practitioner feedback.
              </p>
              <div className="mt-3.5">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary hover:underline cursor-pointer"
                >
                  <span>Explore clinical calculators</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Modal */}
      <ProductSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSuccess={handleProductCreated}
      />
    </div>
  );
}

function ProductsFallback() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative w-full bg-[#180915] text-white pt-24 pb-36 sm:pt-32 sm:pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/pages/jobs/job_circle_bubble_banner.png"
            alt="Pentasent Products Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 mix-blend-screen"
          />
          <div className="absolute inset-x-0 h-full bg-linear-to-r from-black/40 via-secondary/60 to-transparent" />
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 xs:px-6 text-center relative z-10">
          <div className="mb-3 text-[13px] xs:text-[14px] sm:text-[15px] font-medium tracking-[0.06em] text-white/80">
            <span>Healthcare Innovation Directory</span>
          </div>

          <h1 className="mt-3.5 sm:mt-4 text-[34px] xs:text-[40px] sm:text-[48px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.08] sm:leading-[1.05] tracking-[-1px] text-white">
            Healthcare <span className="text-[#ffd3f0]">Products &amp; Tools</span>
          </h1>

          <p className="mt-4 sm:mt-6 max-w-2xl lg:max-w-3xl text-[14px] xs:text-[15.5px] sm:text-[17px] leading-[1.65] sm:leading-[1.75] text-white/80">
            Discover verified clinical software, medical hardware, diagnostic algorithms, and digital health tools shaping patient care.
          </p>
        </div>
      </section>

      {/* FILTER SKELETON */}
      <div className="relative mx-auto -mt-20 w-full max-w-5xl px-4 xs:px-6 z-20">
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-muted shadow-xs">
          <div className="h-11 sm:h-12 bg-[#faf9f8] border border-[#ded9d5] rounded-lg animate-pulse" />
        </div>
      </div>

      {/* CATEGORIES SHIMMER & LIST SHIMMER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-16 pb-24">
        <ProductCategoriesShimmer />
        <div className="mt-10">
          <ProductsListShimmer />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsContent />
    </Suspense>
  );
}
