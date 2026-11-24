import {
  createPortableTextBody,
  flexibleDate,
  flexibleSchedule,
  portableTextCaption,
  seo,
  textModule,
} from '@hmidmismi/sanity-core';
import { imageModule, kickerModule, peopleModule } from '../lib';
import { article, event, material, notice, page, person, schedule, workshop, workshopType } from './documents';
import { localizedSlugType } from './localizedSlugType';

/** Document types an internal link in rich text may point at. */
const internalLinkTypes = ['page', 'event', 'article', 'person'];

export const schemaTypes = [
  article,
  event,
  flexibleDate,
  flexibleSchedule,
  imageModule,
  kickerModule,
  localizedSlugType,
  material,
  notice,
  page,
  peopleModule,
  person,
  createPortableTextBody({ internalLinkTypes, extraTypes: ['table', 'code'] }),
  portableTextCaption,
  schedule,
  seo,
  textModule,
  workshop,
  workshopType,
];
