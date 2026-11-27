// apps/web/src/lib/sanity/queries/notice.ts
import { defineQuery } from 'groq';
import { sanityClient } from '../client';
import { SLUG } from '../groq';

/** The notice an editor wrote that is switched on and inside its window, the most recently edited first. */
export const NOTICE_QUERY = defineQuery(`*[_type == "notice" && active != false
  && (!defined(startsAt) || startsAt <= $now) && (!defined(endsAt) || endsAt > $now)
] | order(_updatedAt desc)[0]{ message, link }`);

/**
 * Events, exhibitions and workshops with a date that covers `$today`. Which of them is under way right now, by time of
 * day, is decided in code (`isHappening`), because the times are plain strings. `kind` is `event`, `exhibition` or
 * `workshop`, which says which section the entry's page is in.
 */
export const HAPPENING_QUERY = defineQuery(`*[_type in ["event", "workshop"] && defined(${SLUG}) && status != "cancelled"
  && count(dateTime.entries[date <= $today && coalesce(endDate, date) >= $today]) > 0
]{ "kind": select(_type == "event" => coalesce(type, "event"), _type), title, "slug": ${SLUG}, dateTime }`);

/**
 * The active notice.
 *
 * @param now - the moment, as an ISO string.
 * @returns the notice, or null when none is active.
 */
export const getNotice = (now: string) => sanityClient().fetch(NOTICE_QUERY, { now });

/**
 * The entries with a date covering the day.
 *
 * @param today - the day, `YYYY-MM-DD`.
 * @returns the entries, not yet narrowed by time of day.
 */
export const listHappening = (today: string) => sanityClient().fetch(HAPPENING_QUERY, { today });
