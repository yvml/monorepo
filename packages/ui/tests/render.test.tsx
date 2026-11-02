import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  Button,
  Caption,
  ColumnList,
  Eyebrow,
  FieldLabel,
  Hero,
  Inset,
  ItemList,
  Layout,
  Measure,
  Plate,
  Section,
  SectionGroup,
  SkipLink,
  SplitGrid,
  Stack,
  StatusBadge,
  TermList,
  TermRow,
  Tile,
  UiTextProvider,
  CloseButton,
  TileGrid,
  Title,
  Wrap,
} from '../src/components';

/** Server-renders an element to HTML. */
const html = (element: React.ReactElement) => renderToStaticMarkup(element);

describe('components render with the classes of their recipes', () => {
  it('a button takes its variant and size', () => {
    const out = html(
      <Button variant="outline" size="sm">
        Save
      </Button>
    );
    expect(out).toContain('button');
    expect(out).toContain('button--variant_outline');
    expect(out).toContain('button--size_sm');
  });

  it('a title is the tag of its level, styled for that level', () => {
    for (const level of ['h1', 'h2', 'h3', 'h4'] as const) {
      const out = html(<Title level={level}>Heading</Title>);
      expect(out).toContain(`<${level}`);
      expect(out).toContain(`title--level_${level}`);
    }
  });

  it('a title can render another tag than its level', () => {
    expect(
      html(
        <Title level="h1" as="p">
          x
        </Title>
      )
    ).toMatch(/^<p /);
  });

  it('layout primitives carry their gap and padding variants', () => {
    expect(
      html(
        <Stack gap="4" padBlock="8" padInline="4">
          x
        </Stack>
      )
    ).toMatch(/layout-stack--gap_4.*layout-stack--padBlock_8.*layout-stack--padInline_4/s);
    expect(
      html(
        <Wrap gap="2" align="center">
          x
        </Wrap>
      )
    ).toContain('layout-wrap--gap_2');
    expect(html(<ItemList inline>x</ItemList>)).toContain('item-list--inline_true');
    expect(html(<Measure>x</Measure>)).toContain('measure');
    expect(html(<Inset>x</Inset>)).toContain('inset');
    expect(html(<Layout kind="overview">x</Layout>)).toContain('layout--kind_overview');
    expect(html(<SplitGrid gap="lg">x</SplitGrid>)).toContain('split-grid--gap_lg');
    expect(
      html(
        <TileGrid>
          <li>x</li>
        </TileGrid>
      )
    ).toContain('label-grid');
  });

  it('text roles render with their recipes', () => {
    expect(html(<Eyebrow>Label</Eyebrow>)).toContain('eyebrow');
    expect(html(<Caption>Note</Caption>)).toContain('caption');
    expect(html(<FieldLabel>Name</FieldLabel>)).toContain('field-label--spaced_true');
  });

  it('a section names itself and carries its tone', () => {
    const out = html(
      <Section id="credits" label="Credits" tone="sand">
        x
      </Section>
    );
    expect(out).toContain('id="credits"');
    expect(out).toContain('Credits');
    expect(out).toContain('section');
    expect(
      html(
        <SectionGroup id="g" label="Group">
          x
        </SectionGroup>
      )
    ).toContain('Group');
  });

  it('a tile and a plate take their hue', () => {
    const tile = html(
      <Tile hue="3" figure="12" onClick={() => {}}>
        Label
      </Tile>
    );
    expect(tile).toContain('hue--hue_3');
    expect(tile).toContain('tile');
    expect(html(<Plate hue="5" name="NW" number="12" />)).toContain('hue--hue_5');
  });

  it('term lists keep their term and value', () => {
    const out = html(
      <TermList>
        <TermRow term="Label">NWCRI</TermRow>
      </TermList>
    );
    expect(out).toContain('Label');
    expect(out).toContain('NWCRI');
    expect(out).toContain('term-list');
    expect(
      html(
        <ColumnList width="single">
          <li>x</li>
        </ColumnList>
      )
    ).toContain('column-list--width_single');
  });

  it('a hero renders the four text slots and its link', () => {
    const out = html(
      <Hero
        orientation="landscape"
        kicker="Editorial"
        headline="Remembering"
        summary="A guide."
        link={(className) => (
          <a className={className} href="/x">
            Read
          </a>
        )}
      />
    );
    for (const text of ['Editorial', 'Remembering', 'A guide.', 'Read'])
      expect(out).toContain(text);
    expect(out).toContain('hero__root--orientation_landscape');
  });

  it('a status badge and a skip link', () => {
    expect(html(<StatusBadge state="ok">All systems operational</StatusBadge>)).toContain(
      'status-badge--state_ok'
    );
    const skip = html(<SkipLink target="main">Skip to content</SkipLink>);
    expect(skip).toContain('href="#main"');
  });

  it('shows the default wording, and a project can change any entry', () => {
    expect(html(<CloseButton />)).toContain('aria-label="Close"');
    const changed = html(
      <UiTextProvider text={{ close: 'Fermer' }}>
        <CloseButton />
      </UiTextProvider>
    );
    expect(changed).toContain('aria-label="Fermer"');
  });
});
