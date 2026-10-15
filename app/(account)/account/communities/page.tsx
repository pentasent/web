'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import AccountHero from '@/components/account/AccountHero';
import { ACCOUNT_HERO_COPY } from '@/data/account';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api';
import { PublicCommunityDTO } from '@/types/communities';
import { AccountCommunitiesShimmer } from '@/shimmer/tracker/CommunityTrackerShimmer';
import CreateCommunityModal from '@/components/communities/CreateCommunityModal';
import DeleteCommunityModal from '@/components/communities/DeleteCommunityModal';
import {
  Users,
  PlusCircle,
  Sparkles,
  ExternalLink,
  Edit3,
  Trash2,
  Lock,
  Globe,
  CreditCard,
  MessageSquare,
  Shield,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { notify } from '@/components/ui/toast';

export default function AccountCommunitiesPage() {
  const { user, status } = useAuth();
  const copy = ACCOUNT_HERO_COPY.communities;
  const isAuthLoading = status === 'loading';
  const isLoggedIn = status === 'authenticated' && !!user;

  const [activeTab, setActiveTab] = useState<'created' | 'joined'>('created');
  const [createdCommunities, setCreatedCommunities] = useState<PublicCommunityDTO[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<PublicCommunityDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<PublicCommunityDTO | null>(null);
  const [deletingCommunity, setDeletingCommunity] = useState<PublicCommunityDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUserCommunities = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient<{
        created: PublicCommunityDTO[];
        joined: PublicCommunityDTO[];
      }>('/communities/mine');

      if (res.success && res.data) {
        setCreatedCommunities(res.data.created || []);
        setJoinedCommunities(res.data.joined || []);
      }
    } catch (err) {
      console.warn('Error fetching user communities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      if (isLoggedIn) {
        void fetchUserCommunities();
      } else if (!isAuthLoading) {
        setIsLoading(false);
      }
    };

    void init();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, isAuthLoading]);

  // Handle Delete with optimistic UI
  const handleConfirmDelete = async () => {
    if (!deletingCommunity) return;
    const targetId = deletingCommunity.id;
    setIsDeleting(true);

    const prevCreated = [...createdCommunities];
    setCreatedCommunities((prev) => prev.filter((c) => c.id !== targetId));
    setDeletingCommunity(null);

    try {
      const res = await apiClient(`/communities/${targetId}`, { method: 'DELETE' });
      if (res.success) {
        notify.success('Community deleted successfully.');
      } else {
        setCreatedCommunities(prevCreated);
        notify.error(res.error?.message || 'Failed to delete community.');
      }
    } catch {
      setCreatedCommunities(prevCreated);
      notify.error('Error connecting to server to delete community.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Leave
  const handleLeaveCommunity = async (communityId: string, name: string) => {
    if (!confirm(`Are you sure you want to leave ${name}?`)) return;
    try {
      const res = await apiClient(`/communities/${communityId}/leave`, { method: 'POST' });
      if (res.success) {
        setJoinedCommunities((prev) => prev.filter((c) => c.id !== communityId));
        notify.success(`Left ${name}.`);
      } else {
        notify.error(res.error?.message || 'Failed to leave community.');
      }
    } catch {
      notify.error('Error connecting to server.');
    }
  };

  return (
    <main className="min-h-screen bg-white text-foreground">
      {/* Account Hero */}
      <AccountHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12 py-8 sm:py-10">
        {/* Top Control Bar: Tabs + Create Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-[#e8e4e1]">
          {/* Tab buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('created')}
              className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                activeTab === 'created'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-[#faf8f6] text-primary-text hover:text-foreground border border-[#ded9d5]'
              }`}
            >
              Circles I Lead ({createdCommunities.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('joined')}
              className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                activeTab === 'joined'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-[#faf8f6] text-primary-text hover:text-foreground border border-[#ded9d5]'
              }`}
            >
              Joined Circles ({joinedCommunities.length})
            </button>
          </div>

          {/* Create Button */}
          <button
            type="button"
            onClick={() => {
              setEditingCommunity(null);
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[13px] font-bold shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>Create New Community</span>
          </button>
        </div>

        {/* Content Stream */}
        <div className="pt-6">
          {isLoading ? (
            <AccountCommunitiesShimmer />
          ) : activeTab === 'created' ? (
            /* Created Communities Section */
            createdCommunities.length > 0 ? (
              <div className="divide-y divide-[#e8e4e1]">
                {createdCommunities.map((comm) => (
                  <div
                    key={comm.id}
                    className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="relative w-14 h-14 rounded-lg bg-[#faf8f6] border border-[#ded9d5] flex items-center justify-center shrink-0 overflow-hidden">
                        {comm.iconUrl && comm.iconUrl.startsWith('/') ? (
                          <Image
                            src={comm.iconUrl}
                            alt={comm.name}
                            width={56}
                            height={56}
                            className="object-contain p-2"
                          />
                        ) : comm.iconUrl && comm.iconUrl.startsWith('http') ? (
                          <Image
                            src={comm.iconUrl}
                            alt={comm.name}
                            width={56}
                            height={56}
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <Users size={22} className="text-primary" />
                        )}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/communities/${comm.slug}`}
                            className="text-[16px] font-bold text-foreground hover:text-primary transition-colors truncate"
                          >
                            {comm.name}
                          </Link>

                          {comm.visibility === 'private' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              <Lock size={10} />
                              <span>Private</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <Globe size={10} />
                              <span>Public</span>
                            </span>
                          )}

                          {comm.pricingType === 'paid' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                              <CreditCard size={10} />
                              <span>${comm.price}/mo</span>
                            </span>
                          )}
                        </div>

                        <p className="text-[13.5px] text-primary-text line-clamp-1">
                          {comm.tagline || comm.description}
                        </p>

                        <div className="flex items-center gap-4 text-[12px] text-primary-text/80 pt-0.5">
                          <span>{comm.memberCount} members</span>
                          <span>·</span>
                          <span>{comm.postCount} discussions</span>
                          {comm.tags && comm.tags.length > 0 && (
                            <>
                              <span>·</span>
                              <span>{comm.tags.join(', ')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="shrink-0 flex items-center gap-2 pt-2 md:pt-0">
                      <Link
                        href={`/communities/${comm.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ded9d5] bg-white hover:bg-[#faf8f6] text-[13px] font-semibold text-foreground transition-colors"
                      >
                        <span>View</span>
                        <ExternalLink size={13} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommunity(comm);
                          setIsCreateModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ded9d5] bg-white hover:bg-[#faf8f6] text-[13px] font-semibold text-foreground transition-colors cursor-pointer"
                      >
                        <Edit3 size={13} className="text-primary" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingCommunity(comm)}
                        className="p-2 rounded-lg text-primary-text hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete community"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-lg border border-dashed border-[#ded9d5] bg-[#faf8f6]">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Users size={22} />
                </div>
                <h3 className="text-[17px] font-bold text-foreground">
                  You Haven&apos;t Created Any Communities Yet
                </h3>
                <p className="mt-1 text-[13.5px] text-primary-text max-w-sm mx-auto">
                  Lead a specialized medical circle, establish peer review boards, or organize disease-specific research groups.
                </p>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCommunity(null);
                      setIsCreateModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[13px] font-bold shadow-xs cursor-pointer"
                  >
                    <PlusCircle size={15} />
                    <span>Create Your First Community</span>
                  </button>
                </div>
              </div>
            )
          ) : (
            /* Joined Communities Section */
            joinedCommunities.length > 0 ? (
              <div className="divide-y divide-[#e8e4e1]">
                {joinedCommunities.map((comm) => (
                  <div
                    key={comm.id}
                    className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="relative w-14 h-14 rounded-lg bg-[#faf8f6] border border-[#ded9d5] flex items-center justify-center shrink-0 overflow-hidden">
                        {comm.iconUrl && comm.iconUrl.startsWith('/') ? (
                          <Image
                            src={comm.iconUrl}
                            alt={comm.name}
                            width={56}
                            height={56}
                            className="object-contain p-2"
                          />
                        ) : comm.iconUrl && comm.iconUrl.startsWith('http') ? (
                          <Image
                            src={comm.iconUrl}
                            alt={comm.name}
                            width={56}
                            height={56}
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <Users size={22} className="text-primary" />
                        )}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/communities/${comm.slug}`}
                            className="text-[16px] font-bold text-foreground hover:text-primary transition-colors truncate"
                          >
                            {comm.name}
                          </Link>

                          <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Active Member
                          </span>
                        </div>

                        <p className="text-[13.5px] text-primary-text line-clamp-1">
                          {comm.tagline || comm.description}
                        </p>

                        <div className="flex items-center gap-3 text-[12px] text-primary-text/80 pt-0.5">
                          <span>{comm.memberCount} members</span>
                          <span>·</span>
                          <span>{comm.postCount} discussions</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2.5 pt-2 md:pt-0">
                      <Link
                        href={`/communities/${comm.slug}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold transition-all"
                      >
                        <span>Open Circle</span>
                        <ChevronRight size={13} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleLeaveCommunity(comm.id, comm.name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ded9d5] bg-white hover:bg-red-50 text-[12.5px] font-semibold text-primary-text hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <LogOut size={13} />
                        <span>Leave</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-lg border border-dashed border-[#ded9d5] bg-[#faf8f6]">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Users size={22} />
                </div>
                <h3 className="text-[17px] font-bold text-foreground">
                  You Haven&apos;t Joined Any Circles Yet
                </h3>
                <p className="mt-1 text-[13.5px] text-primary-text max-w-sm mx-auto">
                  Explore public clinical circles and connect with verified peers across medical disciplines.
                </p>
                <div className="mt-5">
                  <Link
                    href="/communities"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[13px] font-bold shadow-xs"
                  >
                    <span>Browse Public Communities</span>
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isCreateModalOpen && (
        <CreateCommunityModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingCommunity(null);
          }}
          editingCommunity={editingCommunity}
          onSuccess={() => {
            void fetchUserCommunities();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingCommunity && (
        <DeleteCommunityModal
          isOpen={!!deletingCommunity}
          community={deletingCommunity}
          isDeleting={isDeleting}
          onClose={() => setDeletingCommunity(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </main>
  );
}
