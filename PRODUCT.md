# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Workshop participants and the wider community, equally. Participants find and book weekend, material-based workshops, in English or Spanish. The community follows events, exhibitions, the Lazy Eye Gallery, people and news. Donors arrive through the Support page. The studio's own staff edit content in Sanity Studio.

## Product Purpose

The public site of the Yucca Valley Material Lab (YVML), 57275 Canterbury Street, Yucca Valley, CA 92284, in the Morongo Basin. It lists workshops, events, exhibitions, articles, people, youth programs and the Lazy Eye Gallery, takes signups, and asks for support. Success is a visitor finding a workshop or event and registering, or choosing to give.

## Positioning

YVML champions a decentralized, inclusive, and affordable model for art education grounded in direct material exploration, with an anti-ableist approach that challenges dominant hierarchies of ability and celebrates diverse learning styles and creative outcomes.

## Operating Context

Workshops are weekend, hands-on classes by material (glass casting, ceramics, metalwork, printmaking, fiber arts, stone carving, earth building and others) plus professional development. Each shows an instructor, dates, type, price and availability, including sold-out. Registration and the newsletter go through Keela. Content lives in Sanity. The site is bilingual: English at `/`, Spanish at `/es`.

## Capabilities and Constraints

- Next 15 (pages router) in `apps/web`, Sanity Studio in `apps/studio`, shared UI, auth and Sanity helpers from the `@hmidmismi/*` packages. See `CLAUDE.md` and `HANDOFF.md`.
- Every page is incremental static. Listings are filterable, and the filter choices live in the address.
- The site is behind a private preview login until launch. Who may see it is decided in `src/proxy.preview.ts`.
- Every visible string exists in English and Spanish.
- No monospace type. No instructional or hint copy in the UI or schema unless asked.
- The visual direction is undecided. Eight static mock directions are in `mocks/` (plaster, steel, adobe, glass, table, boxes, inventory, and the Lazy Eye concepts). None is chosen.

## Brand Commitments

Name: Yucca Valley Material Lab (short name YVML). Contact: info@yvml.org. The Lazy Eye Gallery is its own program with its own identity in the mocks.

## Evidence on Hand

Real workshop, people and artwork content is in Sanity and in the mocks (`mocks/dist`, 27 workshops, 22 Lazy Eye works, staff). Support tiers shown in the mocks ($50, $400, $2,000, $5,000, $10/mo) are mock copy and unconfirmed. No testimonials, press or participant counts exist in the repo and none are to be invented.

## Product Principles

1. Registering for a workshop or event is the primary path. It stays short, and sold-out or full states are honest.
2. English and Spanish are equal. Nothing ships in only one.
3. Access is part of the mission. Price, scholarships and accessibility are stated plainly, not buried.
4. The material and the work lead. Photography of making and of finished work carries the site.
5. Staff can run it. Content changes happen in Sanity, not in code.

## Accessibility & Inclusion

The mission is explicitly anti-ableist, so accessibility is a product requirement, not polish. No numeric target is confirmed yet (assume WCAG 2.2 AA until told otherwise). Mocks already use skip links, visible focus and 44px targets.
