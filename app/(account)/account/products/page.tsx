'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AccountHero from '@/components/account/AccountHero';
import { ACCOUNT_HERO_COPY } from '@/data/account';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api';
import { ProductCardDTO, PublicProductDTO } from '@/types/products';
import ProductCard from '@/components/products/ProductCard';
import ProductSubmitModal from '@/components/forms/ProductSubmitModal';
import { AccountProductsListShimmer } from '@/shimmer/tracker';
import {
  Package,
  PlusCircle,
  Sparkles,
  ExternalLink,
  Edit3,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  PackageSearch,
  X,
} from 'lucide-react';
import { notify } from '@/components/ui/toast';
import { invalidateProductsCache } from '@/lib/products-cache';

export default function AccountProductsPage() {
  const { user, status } = useAuth();
  const copy = ACCOUNT_HERO_COPY.products;
  const isAuthLoading = status === 'loading';
  const isLoggedIn = status === 'authenticated' && !!user;

  const [myProducts, setMyProducts] = useState<ProductCardDTO[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductCardDTO | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductCardDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Lock background scroll when delete product modal is open
  useEffect(() => {
    if (deletingProduct) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [deletingProduct]);

  const fetchMyProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await apiClient<ProductCardDTO[]>('/products/mine');
      if (res.success && res.data) {
        setMyProducts(res.data);
      } else {
        setMyProducts([]);
      }
    } catch (err) {
      console.warn('Unable to load user products:', err);
      setMyProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      if (isLoggedIn) {
        void fetchMyProducts();
      } else if (!isAuthLoading) {
        setIsLoadingProducts(false);
      }
    };

    void init();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, isAuthLoading]);

  // Handle immediate delete with optimistic UI
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    const targetId = deletingProduct.id;
    setIsDeleting(true);

    // Optimistically remove from state immediately so user never has to wait
    const previousProducts = [...myProducts];
    setMyProducts((prev) => prev.filter((p) => p.id !== targetId));
    setDeletingProduct(null);

    try {
      const res = await apiClient<{ id: string; deleted: boolean }>(`/products/${targetId}`, {
        method: 'DELETE',
      });
      if (res.success) {
        invalidateProductsCache(deletingProduct.slug);
        notify.success('Product deleted successfully.');
      } else {
        // Revert on failure
        setMyProducts(previousProducts);
        notify.error(res.error?.message || 'Failed to delete product.');
      }
    } catch {
      setMyProducts(previousProducts);
      notify.error('Error connecting to server to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (product: ProductCardDTO) => {
    setEditingProduct(product);
    setIsSubmitModalOpen(true);
  };

  const handleModalSuccess = (savedProduct: PublicProductDTO) => {
    invalidateProductsCache(savedProduct.slug);
    notify.success(editingProduct ? 'Product updated successfully.' : 'Product published successfully to directory!');
    // Refresh list
    void fetchMyProducts();
  };

  return (
    <main className="min-h-screen bg-white">
      <AccountHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Dashboard Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#e8e4e1] mb-2">
          <div>
            <h2 className="text-[22px] sm:text-[24px] font-bold text-foreground tracking-tight">
              Your Published Products
            </h2>
            <p className="mt-1 text-[14px] text-primary-text">
              Manage clinical software listings, launch updates, and community reviews.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setIsSubmitModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[13.5px] font-bold transition-all cursor-pointer shadow-xs"
            >
              <PlusCircle size={15} />
              <span>Submit New Product</span>
            </button>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#ded9d5] bg-white hover:bg-[#faf9f8] text-[13.5px] font-semibold text-foreground transition-colors cursor-pointer"
            >
              <span>Browse Directory</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        {/* Content Section */}
        {isAuthLoading || isLoadingProducts ? (
          <div className="py-6">
            <AccountProductsListShimmer />
          </div>
        ) : !isLoggedIn ? (
          /* Login Required State */
          <div className="py-16 text-center max-w-md mx-auto">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center mb-4">
              <Package size={26} />
            </div>
            <h3 className="text-[20px] font-bold text-foreground">
              Sign In to Manage Products
            </h3>
            <p className="mt-2 text-[14.5px] text-primary-text leading-relaxed">
              Log in to your Pentasent account to launch and manage healthcare products.
            </p>
            <div className="mt-5">
              <Link
                href="/auth/login?redirect=/account/products"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-primary text-white text-[14px] font-bold hover:bg-primary-hover transition-colors"
              >
                <span>Log In</span>
              </Link>
            </div>
          </div>
        ) : myProducts.length > 0 ? (
          /* User Products List (Unboxed, clean) */
          <div className="divide-y divide-[#e8e4e1]">
            {myProducts.map((prod, index) => (
              <ProductCard
                key={prod.id}
                product={prod}
                basePath="/products"
                index={index}
                isOwner={true}
                actions={
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
                      <span>{prod.upvoteCount} Upvotes</span>
                      <span>·</span>
                      <span>{prod.reviewCount} Reviews</span>
                      <span>·</span>
                      <span>Status: {prod.isVerified ? 'Verified' : 'Pending'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${prod.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[12.5px] font-semibold text-primary-text hover:text-foreground border border-[#ded9d5] hover:bg-[#faf9f8] transition-colors"
                      >
                        <ExternalLink size={13} />
                        <span>View Public Page</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleEditClick(prod)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-[12.5px] font-bold bg-[#faf9f8] hover:bg-white text-primary border border-[#ded9d5] hover:border-primary transition-all cursor-pointer"
                      >
                        <Edit3 size={13} />
                        <span>Edit Product</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingProduct(prod)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[12.5px] font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        ) : (
          /* Empty State (Unboxed) */
          <div className="py-16 sm:py-20 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#f4ddf0] text-primary flex items-center justify-center mb-4">
              <PackageSearch size={26} />
            </div>
            <h3 className="text-[22px] font-bold text-foreground">
              No Published Products Yet
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-primary-text">
              As a Pentasent healthcare creator, you can showcase clinical tools, diagnostic algorithms, digital therapeutics, and medical devices directly to our global community.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsSubmitModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white text-[14px] font-bold transition-all cursor-pointer shadow-xs"
              >
                <PlusCircle size={16} />
                <span>Submit Your First Healthtech Product</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setDeletingProduct(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Dialog Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-lg bg-white border border-[#ded9d5] shadow-2xl z-10 overflow-hidden"
            >
              {/* Header (Fixed shrink-0) */}
              <div className="shrink-0 flex items-center justify-between px-6 py-4.5 border-b border-[#f0ece9] bg-white">
                <div className="flex items-center gap-3 text-red-600">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-[17.5px] font-bold text-foreground">
                      Delete Product Listing?
                    </h3>
                    <p className="text-[12px] text-muted-foreground">
                      Healthtech directory management
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => !isDeleting && setDeletingProduct(null)}
                  disabled={isDeleting}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <p className="text-[14px] leading-relaxed text-primary-text">
                  Are you sure you want to delete <span className="font-bold text-foreground">&quot;{deletingProduct.name}&quot;</span>? All associated reviews, screenshots, features, and comments will be permanently removed.
                </p>
              </div>

              {/* Footer (Fixed shrink-0 with colored background #faf8f6) */}
              <div className="shrink-0 px-6 py-4 border-t border-[#f0ece9] bg-[#faf8f6] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingProduct(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg border border-[#ded9d5] bg-white hover:bg-[#faf9f8] text-[13px] font-semibold text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isDeleting && <Loader2 size={14} className="animate-spin" />}
                  <span>Delete Product</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submit / Edit Modal */}
      <ProductSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          setEditingProduct(null);
        }}
        onSuccess={handleModalSuccess}
        editingProduct={editingProduct}
      />
    </main>
  );
}
