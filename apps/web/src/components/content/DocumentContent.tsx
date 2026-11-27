// apps/web/src/components/content/DocumentContent.tsx
import { ContentModules } from './ContentModules';

/**
 * The content modules of a document, click-to-edit as a whole in Presentation. Every page about a document renders its
 * content with this.
 *
 * @param props - the modules, and the `data-sanity` attribute of the document's `content` field.
 * @returns the content.
 */
export function DocumentContent({ modules, attr }: { modules: Parameters<typeof ContentModules>[0]['modules']; attr?: string }) {
  return (
    <div data-sanity={attr}>
      <ContentModules modules={modules} />
    </div>
  );
}
