import { ProductCardDTO, PublicProductDTO } from '@/types/products';

interface ProductsCacheData {
  items: ProductCardDTO[];
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes fresh cache

// In-memory module cache (survives client-side route transitions)
let cachedProductsList: ProductsCacheData | null = null;
const productDetailMap = new Map<string, { data: PublicProductDTO; timestamp: number }>();
const productSummaryMap = new Map<string, ProductCardDTO>();

export function getCachedProducts(): ProductCardDTO[] | null {
  if (!cachedProductsList) return null;
  const isFresh = Date.now() - cachedProductsList.timestamp < CACHE_TTL_MS;
  if (!isFresh) {
    cachedProductsList = null;
    return null;
  }
  return cachedProductsList.items;
}

export function setCachedProducts(items: ProductCardDTO[]): void {
  cachedProductsList = {
    items,
    timestamp: Date.now(),
  };
  // Also populate summary map by slug for instant preview in detail page
  for (const item of items) {
    if (item.slug) {
      productSummaryMap.set(item.slug, item);
    }
  }
}

export function getCachedProductBySlug(
  slug: string
): { full?: PublicProductDTO; preview?: ProductCardDTO } | null {
  // Check full detail first
  const fullEntry = productDetailMap.get(slug);
  if (fullEntry && Date.now() - fullEntry.timestamp < CACHE_TTL_MS) {
    return { full: fullEntry.data };
  }

  // Fallback to preview card data from the list
  const preview = productSummaryMap.get(slug);
  if (preview) {
    return { preview };
  }

  return null;
}

export function setCachedProductDetail(slug: string, data: PublicProductDTO): void {
  productDetailMap.set(slug, {
    data,
    timestamp: Date.now(),
  });
}

export function invalidateProductsCache(slug?: string): void {
  cachedProductsList = null;
  if (slug) {
    productDetailMap.delete(slug);
    productSummaryMap.delete(slug);
  } else {
    productDetailMap.clear();
    productSummaryMap.clear();
  }
}
