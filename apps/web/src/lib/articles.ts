import { CONTENT, type ContentModule, type Localized } from './events';
import { clientFor } from './sanity';

const SLUG = `slug[language == "en" || _key == "en"][0].value.current`;

/** An article as the News & Articles listing shows it. */
export type ArticleSummary = { _id: string; slug: string; title: Localized<string>; createdAt: string };

/** An article page: the summary plus its content modules. */
export type Article = ArticleSummary & { content?: ContentModule[] };

/**
 * Every article, newest first.
 *
 * @param draft - whether the request is in draft mode.
 * @returns the articles.
 */
export function listArticles(draft: boolean) {
  return clientFor(draft).fetch<ArticleSummary[]>(
    `*[_type == "article" && defined(${SLUG})] | order(_createdAt desc){_id, "slug": ${SLUG}, title, "createdAt": _createdAt}`
  );
}

/**
 * One article by slug.
 *
 * @param slug - the article's slug.
 * @param draft - whether the request is in draft mode.
 * @returns the article, or null.
 */
export function getArticle(slug: string, draft: boolean) {
  return clientFor(draft).fetch<Article | null>(
    `*[_type == "article" && ${SLUG} == $slug][0]{_id, "slug": ${SLUG}, title, "createdAt": _createdAt, ${CONTENT}}`,
    { slug }
  );
}
