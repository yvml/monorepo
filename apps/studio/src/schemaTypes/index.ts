import {
  createPortableTextBody,
  flexibleDate,
  flexibleSchedule,
  portableTextCaption,
  seo,
  textModule,
} from '@hmidmismi/sanity-core';
import { imageModule } from '../lib';
import { article, event, material, page, person, schedule, workshop, workshopType } from './documents';
import { localizedSlugType } from './localizedSlugType';

/** Document types an internal link in rich text may point at. */
const internalLinkTypes = ['page', 'event', 'article', 'person'];

export const schemaTypes = [
  article,
  event,
  flexibleDate,
  flexibleSchedule,
  imageModule,
  localizedSlugType,
  material,
  page,
  person,
  createPortableTextBody({ internalLinkTypes, extraTypes: ['table', 'code'] }),
  portableTextCaption,
  schedule,
  seo,
  textModule,
  workshop,
  workshopType,
];
