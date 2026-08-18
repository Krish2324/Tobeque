import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SeasonCollectionItem {
  id: number;
  productId: number;
  displayLabel: string | null;
  sortOrder: number;
  isActive: boolean;
  videoUrl: string | null;
  product: {
    id: number;
    name: string;
    slug: string;
    thumbnail: string | null;
    price: string | number;
    discountPrice: string | number | null;
    images?: Array<{ id: number; imageUrl: string }>;
  } | null;
}

interface UseSeasonCollectionResult {
  items: SeasonCollectionItem[];
  loading: boolean;
  error: string | null;
}

// ─── Image URL helper (same as useProducts) ───────────────────────────────────

export function resolveImageUrl(path: string | null | undefined): string {
  if (!path || typeof path !== 'string' || !path.trim()) return 'https://via.placeholder.com/400x500?text=No+Image';
  const trimmed = path.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) return trimmed;
  const normalizedPath = trimmed.replace(/\\/g, '/');
  const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  return apiBase ? `${apiBase}${cleanPath}` : cleanPath;
}

export function getSeasonItemImage(item: SeasonCollectionItem): string {
  if (item.product?.thumbnail) return resolveImageUrl(item.product.thumbnail);
  if (item.product?.images && item.product.images.length > 0) {
    return resolveImageUrl(item.product.images[0].imageUrl);
  }
  return 'https://via.placeholder.com/400x500?text=No+Image';
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSeasonCollection(): UseSeasonCollectionResult {
  const [items, setItems] = useState<SeasonCollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollection = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/season-collection');
      const data = response.data;
      if (data.success && Array.isArray(data.data)) {
        setItems(data.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('[useSeasonCollection] Failed to fetch:', err);
      setError('Could not load Season Collection.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  return { items, loading, error };
}
