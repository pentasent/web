'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Search, Shield, Award, UserCheck, User } from 'lucide-react';
import { CommunityMemberDTO } from '@/types/communities';
import { apiClient } from '@/lib/api';

interface CommunityMembersProps {
  communityId: string;
  isMember: boolean;
  memberDirectoryVisibility?: string;
}

export default function CommunityMembers({
  communityId,
  isMember,
  memberDirectoryVisibility = 'members_only',
}: CommunityMembersProps) {
  const [members, setMembers] = useState<CommunityMemberDTO[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient<CommunityMemberDTO[]>(`/communities/${communityId}/members`);
        if (isMounted && res.success && res.data) {
          setMembers(res.data);
        }
      } catch (err) {
        console.warn('Error fetching members:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMembers();
    return () => {
      isMounted = false;
    };
  }, [communityId]);

  const filtered = members.filter(
    (m) =>
      m.displayName.toLowerCase().includes(search.toLowerCase()) ||
      (m.headline && m.headline.toLowerCase().includes(search.toLowerCase()))
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200">
            <Award size={11} />
            <span>Owner</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            <Shield size={11} />
            <span>Admin</span>
          </span>
        );
      case 'manager':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
            <UserCheck size={11} />
            <span>Manager</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#faf8f6] text-primary-text border border-[#ede9e5]">
            Member
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8e4e1]">
        <div>
          <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
            Verified Clinicians & Peers
          </span>
          <h3 className="mt-1 text-[20px] sm:text-[22px] font-bold text-foreground">
            Community Member Directory
          </h3>
          <p className="mt-1 text-[14.5px] sm:text-[15px] text-primary-text">
            {members.length} verified clinicians and researchers collaborating in this circle
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary-text"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clinicians by name, specialty..."
            className="w-full pl-9 pr-3.5 py-2 text-[13.5px] rounded-lg border border-[#ded9d5] bg-[#faf8f6] text-foreground placeholder:text-primary-text/70 outline-none focus:border-primary focus:bg-white"
          />
        </div>
      </div>

      {/* Members List (Divide-y unboxed minimal style) */}
      <div className="divide-y divide-[#e8e4e1]">
        {isLoading ? (
          <div className="divide-y divide-[#e8e4e1]" aria-busy="true" aria-label="Loading members">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-4.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 flex-1">
                  <div className="w-12 h-12 rounded-full bg-[#faf8f6] animate-shimmer shrink-0 border border-[#f0ece9]" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4.5 w-40 rounded bg-[#faf8f6] animate-shimmer" />
                    <div className="h-3.5 w-60 rounded bg-[#faf8f6] animate-shimmer" />
                  </div>
                </div>
                <div className="h-6 w-20 rounded bg-[#faf8f6] animate-shimmer shrink-0" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((member) => (
            <div
              key={member.id}
              className="py-4.5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative w-12 h-12 rounded-full bg-[#faf8f6] border border-[#ded9d5] flex items-center justify-center overflow-hidden shrink-0">
                  {member.avatarUrl ? (
                    <Image
                      src={member.avatarUrl}
                      alt={member.displayName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <User size={20} className="text-primary-text" />
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="text-[15.5px] sm:text-[16px] font-bold text-foreground truncate">
                    {member.displayName}
                  </h4>
                  <p className="mt-0.5 text-[13.5px] text-primary-text/85 truncate">
                    {member.headline || 'Healthcare Professional & Verified Clinician'}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                {getRoleBadge(member.role)}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-[14.5px] text-primary-text">
            No clinicians matching your search query.
          </div>
        )}
      </div>
    </div>
  );
}
