import { PublicCommunityDTO, CommunityDetailDTO } from '@/types/communities';

const COMMUNITIES_LIST_CACHE_KEY = 'pentasent_communities_list_cache';
const COMMUNITY_DETAIL_PREFIX = 'pentasent_community_detail_';
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes

interface CacheWrapper<T> {
  data: T;
  timestamp: number;
}

export function getCachedCommunities(): PublicCommunityDTO[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(COMMUNITIES_LIST_CACHE_KEY);
    if (!raw) return null;
    const parsed: CacheWrapper<PublicCommunityDTO[]> = JSON.parse(raw);
    if (Date.now() - parsed.timestamp < CACHE_TTL_MS && Array.isArray(parsed.data) && parsed.data.length > 0) {
      return parsed.data;
    }
  } catch {
    // ignore
  }
  return null;
}

export function setCachedCommunities(communities: PublicCommunityDTO[]): void {
  if (typeof window === 'undefined') return;
  try {
    const wrapper: CacheWrapper<PublicCommunityDTO[]> = {
      data: communities,
      timestamp: Date.now(),
    };
    localStorage.setItem(COMMUNITIES_LIST_CACHE_KEY, JSON.stringify(wrapper));
  } catch {
    // ignore
  }
}

export function getCachedCommunityDetail(slug: string): CommunityDetailDTO | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${COMMUNITY_DETAIL_PREFIX}${slug}`);
    if (!raw) return null;
    const parsed: CacheWrapper<CommunityDetailDTO> = JSON.parse(raw);
    if (Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.data) {
      return parsed.data;
    }
  } catch {
    // ignore
  }
  return null;
}

export function setCachedCommunityDetail(slug: string, detail: CommunityDetailDTO): void {
  if (typeof window === 'undefined') return;
  try {
    const wrapper: CacheWrapper<CommunityDetailDTO> = {
      data: detail,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${COMMUNITY_DETAIL_PREFIX}${slug}`, JSON.stringify(wrapper));
  } catch {
    // ignore
  }
}
