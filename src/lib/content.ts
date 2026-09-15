import type { CollectionEntry } from 'astro:content';

type Property = CollectionEntry<'properties'>;
type Agent = CollectionEntry<'agents'>;

/**
 * A property's URL slug: the optional frontmatter `slug`, otherwise the entry id
 * (the filename without its extension). Cards and getStaticPaths both use this,
 * so a custom slug can never produce a link that 404s.
 */
export const propertySlug = (property: Property) => property.data.slug ?? property.id;

export const propertyHref = (property: Property) => `/properties/${propertySlug(property)}`;

export const agentHref = (agent: Agent) => `/agents/${agent.id}`;

/** Prices are stored as plain numbers plus a currency code. */
export const formatPrice = (amount: number, currency: string, status?: string) => {
  const formatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
  // Rentals are priced per calendar month.
  return status === 'to-let' ? `${formatted} pcm` : formatted;
};

export const formatArea = (area: number) => `${new Intl.NumberFormat('en-GB').format(area)} sq ft`;

export const STATUS_LABELS: Record<Property['data']['status'], string> = {
  'for-sale': 'For sale',
  'under-offer': 'Under offer',
  sold: 'Sold',
  'to-let': 'To let',
};

/** Display order for the grouped archive page. */
export const STATUS_ORDER = ['for-sale', 'under-offer', 'to-let', 'sold'] as const;

export const TYPE_LABELS: Record<Property['data']['type'], string> = {
  house: 'House',
  flat: 'Flat',
  bungalow: 'Bungalow',
  commercial: 'Commercial',
  land: 'Land',
};

export const byNewest = (a: Property, b: Property) =>
  b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf();

/** Featured properties first, then newest first within each group. */
export const byFeaturedThenNewest = (a: Property, b: Property) =>
  Number(b.data.featured) - Number(a.data.featured) || byNewest(a, b);
