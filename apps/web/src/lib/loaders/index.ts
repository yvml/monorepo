// apps/web/src/lib/loaders/index.ts
export { type ArticleListProps, articleListLoader, articleLoader, type ArticleProps } from './article';
export { type EventListProps, eventListLoader, eventLoader, type EventProps } from './event';
export { type PageProps, pageLoader } from './page';
export { type PersonListProps, personListLoader, personLoader, type PersonProps } from './person';
export { onDemandPaths, REVALIDATE, withDraft } from './static';
export { type WorkshopRouteProps, workshopLoader } from './workshop';
