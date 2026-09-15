import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Pages CMS writes reference values using a template (default `{path}`, i.e. the
 * repository path of the referenced file, e.g. "src/content/agents/sarah-whitfield.md").
 * Astro's reference() resolves against the collection entry id, which for the glob
 * loader is the filename without its extension ("sarah-whitfield").
 *
 * This preprocessor accepts any of the shapes Pages CMS may write - a full repo path,
 * a bare filename, or an already-bare slug - and normalises it to the entry id, so the
 * .pages.yml reference field can use `{path}` (the default) or `{name}` without
 * breaking the build.
 */
const entryIdFrom = (value: unknown) =>
  typeof value === 'string'
    ? value
        .trim()
        .replace(/^\/+/, '')
        .replace(/^.*\//, '')
        .replace(/\.(md|mdx|markdown|json|ya?ml)$/i, '')
    : value;

/** Public media path, as written by Pages CMS with `media.output: /media`. */
const mediaPath = z.string().regex(/^\/media\//, 'Image paths must start with /media/');

const properties = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/properties' }),
  schema: z.object({
    title: z.string(),
    // Optional: falls back to the filename (the entry id) when omitted.
    slug: z.string().optional(),
    price: z.number(),
    currency: z.string().default('GBP'),
    status: z.enum(['for-sale', 'sold', 'under-offer', 'to-let']),
    type: z.enum(['house', 'flat', 'bungalow', 'commercial', 'land']),
    address: z.string(),
    city: z.string(),
    postcode: z.string(),
    bedrooms: z.number().default(0),
    bathrooms: z.number().default(0),
    /** Floor area in square feet. */
    area: z.number(),
    featured: z.boolean().default(false),
    image: mediaPath,
    gallery: z.array(mediaPath).optional(),
    features: z.array(z.string()).optional(),
    agent: z.preprocess(entryIdFrom, reference('agents')),
    publishedDate: z.coerce.date(),
  }),
});

const agents = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/agents' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: mediaPath,
    phone: z.string(),
    email: z.string().email(),
    /** One-line bio used on cards and listings. */
    bioShort: z.string(),
    socials: z
      .object({
        linkedin: z.string().url().optional(),
        x: z.string().url().optional(),
        instagram: z.string().url().optional(),
      })
      .optional(),
  }),
});

const navItem = z.object({ label: z.string(), href: z.string() });

/** Singleton: one YAML file, edited in Pages CMS as `type: file`. */
const site = defineCollection({
  loader: glob({ pattern: 'site.yml', base: './src/content/settings' }),
  schema: z.object({
    siteName: z.string(),
    tagline: z.string(),
    contactEmail: z.string().email(),
    contactPhone: z.string(),
    address: z.string(),
    footerText: z.string(),
    socialLinks: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
    navItems: z.array(navItem).default([]),
  }),
});

/** Singleton: home page copy. */
const home = defineCollection({
  loader: glob({ pattern: 'home.yml', base: './src/content/settings' }),
  schema: z.object({
    heroHeading: z.string(),
    heroSubheading: z.string(),
    heroCtaText: z.string(),
    heroCtaLink: z.string(),
    heroImage: mediaPath,
    latestPropertiesHeading: z.string(),
    latestPropertiesCount: z.number().default(6),
    agentsHeading: z.string(),
  }),
});

export const collections = { properties, agents, site, home };
