// apps/web/src/constants/sections.ts
import type { TextKey } from '@/i18n';

/**
 * The sections of the site that list dated entries, each with its own listing at `/<path>`. `docType` is the Sanity
 * document type; events and exhibitions share the `event` document and differ by its `type` field, and a workshop is
 * its own document type.
 */
export const SECTIONS = [
  { type: 'event', docType: 'event', path: 'events', title: 'navEvents', empty: 'emptyEvents' },
  { type: 'exhibition', docType: 'event', path: 'exhibitions', title: 'navExhibitions', empty: 'emptyExhibitions' },
  { type: 'workshop', docType: 'workshop', path: 'workshops', title: 'navWorkshops', empty: 'emptyWorkshops' },
] as const satisfies readonly { type: string; docType: string; path: string; title: TextKey; empty: TextKey }[];

export type Section = (typeof SECTIONS)[number];

export const EVENTS = SECTIONS[0];
export const EXHIBITIONS = SECTIONS[1];
export const WORKSHOPS = SECTIONS[2];
