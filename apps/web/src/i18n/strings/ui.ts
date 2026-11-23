// apps/web/src/i18n/strings/ui.ts
import type { UiText } from '@hmidmismi/ui';

/** The design system's own words in Spanish; English is the package default. */
export const UI_TEXT: Record<string, Partial<UiText>> = {
  es: {
    close: 'Cerrar',
    clear: 'Borrar',
    search: 'Buscar',
    saved: 'Guardado',
    noMatches: 'Sin resultados',
    remove: 'Quitar {name}',
    home: 'Inicio',
    switchToLight: 'Cambiar al tema claro',
    switchToDark: 'Cambiar al tema oscuro',
    utilityNav: 'Utilidades',
    browseNav: 'Explorar',
    footerNav: 'Pie de página',
    breadcrumbNav: 'Ruta de navegación',
    jumpNav: 'En esta página',
    sectionNav: 'En esta sección',
    sectionNavLead: 'En esta sección:',
  },
};
