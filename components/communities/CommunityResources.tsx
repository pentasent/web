'use client';

import React, { useState, useEffect } from 'react';
import { FileText, ExternalLink, BookOpen, Link as LinkIcon, Compass } from 'lucide-react';
import { CommunityResourceDTO } from '@/types/communities';
import { apiClient } from '@/lib/api';

interface CommunityResourcesProps {
  communityId: string;
}

export default function CommunityResources({ communityId }: CommunityResourcesProps) {
  const [resources, setResources] = useState<CommunityResourceDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient<CommunityResourceDTO[]>(`/communities/${communityId}/resources`);
        if (isMounted && res.success && res.data) {
          setResources(res.data);
        }
      } catch (err) {
        console.warn('Error loading resources:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchResources();
    return () => {
      isMounted = false;
    };
  }, [communityId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#e8e4e1]">
        <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
          Clinical Evidence
        </span>
        <h3 className="mt-1 text-[20px] sm:text-[22px] font-bold text-foreground">
          Resources & Guidelines Repository
        </h3>
        <p className="mt-1 text-[14.5px] sm:text-[15px] text-primary-text leading-relaxed">
          Curated guidelines, landmark studies, protocols, and diagnostic references shared with this circle.
        </p>
      </div>

      {/* List with dividers */}
      <div className="divide-y divide-[#e8e4e1]">
        {isLoading ? (
          <div className="divide-y divide-[#e8e4e1]" aria-busy="true" aria-label="Loading resources">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#faf8f6] animate-shimmer shrink-0 border border-[#f0ece9]" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-48 rounded bg-[#faf8f6] animate-shimmer" />
                    <div className="h-4 w-3/4 rounded bg-[#faf8f6] animate-shimmer" />
                    <div className="h-3.5 w-20 rounded bg-[#faf8f6] animate-shimmer" />
                  </div>
                </div>
                <div className="h-8 w-24 rounded-md bg-[#faf8f6] animate-shimmer shrink-0" />
              </div>
            ))}
          </div>
        ) : resources.length > 0 ? (
          resources.map((res) => (
            <div key={res.id} className="py-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#faf8f6] border border-[#ded9d5] flex items-center justify-center text-primary shrink-0">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="text-[16px] sm:text-[17px] font-bold text-foreground leading-snug">
                    {res.title}
                  </h4>
                  {res.description && (
                    <p className="mt-1.5 text-[14.5px] sm:text-[15px] text-primary-text leading-relaxed">
                      {res.description}
                    </p>
                  )}
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#faf7f5] text-primary border border-[#f0ece9]">
                      {res.resourceType}
                    </span>
                  </div>
                </div>
              </div>

              {res.externalUrl && (
                <a
                  href={res.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#ded9d5] bg-[#faf8f6] hover:bg-white text-[13px] font-semibold text-primary transition-colors shrink-0"
                >
                  <span>Open link</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <BookOpen size={20} />
            </div>
            <h4 className="text-[17px] font-bold text-foreground">
              No Resources Added Yet
            </h4>
            <p className="mt-1.5 text-[14.5px] text-primary-text max-w-sm mx-auto leading-relaxed">
              Clinical guidelines, calculators, and protocols published by community administrators will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
