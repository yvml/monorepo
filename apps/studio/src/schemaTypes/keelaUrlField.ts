import { defineField } from 'sanity';

/** The public Keela form address for a dated entry. Only `https` addresses on keela.co are accepted. */
export const keelaUrlField = () =>
  defineField({
    name: 'keelaUrl',
    title: 'Keela registration form',
    type: 'url',
    validation: (Rule) =>
      Rule.uri({ scheme: ['https'] }).custom((value) => {
        if (!value) return true;
        try {
          const { hostname } = new URL(value);
          return hostname === 'keela.co' || hostname.endsWith('.keela.co')
            ? true
            : 'Use an address on keela.co.';
        } catch {
          return 'Enter a full https address.';
        }
      }),
  });
