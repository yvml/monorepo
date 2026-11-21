import { defineQuery } from 'groq';
import { clientFor } from '../client';
import { CONTENT, SLUG } from '../groq';
import type { ARTICLE_QUERY_RESULT, ARTICLES_QUERY_RESULT } from '../types';

const SUMMARY = `_id, "slug": ${SLUG}, title, "createdAt": _createdAt`;

export const ARTICLES_QUERY = defineQuery(
  `*[_type == "article" && defined(${SLUG})] | order(_createdAt desc){ ${SUMMARY} }`
);
export const ARTICLE_QUERY = defineQuery(`*[_type == "article" && ${SLUG} == $slug][0]{ ${SUMMARY}, ${CONTENT} }`);

/** An article as the News & Articles listing shows it. */
export type ArticleSummary = ARTICLES_QUERY_RESULT[number];

/** An article page: the summary plus its content modules. */
export type ArticleDetail = NonNullable<ARTICLE_QUERY_RESULT>;

/**
 * Every article, newest first.
 *
 * @param draft - whether the request is in draft mode.
 * @returns the articles.
 */
export const listArticles = (draft: boolean) => clientFor(draft).fetch(ARTICLES_QUERY);

/**
 * One article by slug.
 *
 * @param slug - the article's slug.
 * @param draft - whether the request is in draft mode.
 * @returns the article, or null.
 */
export const getArticle = (slug: string, draft: boolean) => clientFor(draft).fetch(ARTICLE_QUERY, { slug });
