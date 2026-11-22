// apps/web/src/lib/text.ts
import type { UiText } from '@hmidmismi/ui';
import { activeLocale } from './locale';

/**
 * Every word the app itself puts on a page: navigation, headings of listings, filter labels, empty states. Content that
 * editors write comes from the studio; the design system's own words (`Close`, `Clear`) come from `UI_TEXT` below.
 * English is the source; a language added to `LOCALES` needs an entry in `TEXT` for every key.
 */
const en = {
  // Navigation
  navEvents: 'Events',
  navExhibitions: 'Exhibitions',
  navWorkshops: 'Workshops',
  navAbout: 'About YVML',
  navHistory: 'History',
  navNews: 'News & Articles',
  navPress: 'Press',
  navStaff: 'Staff',
  navPeople: 'People',
  navGovernance: 'Governance',
  navContact: 'Contact Us',
  navSupport: 'Support Us',
  navDonate: 'Donate',
  navPlannedGiving: 'Planned Giving',
  navCorporateSponsorship: 'Corporate Sponsorship',
  navFoundationSupport: 'Foundation Support',
  navGovernmentPartners: 'Government Partners',
  navDonorInformation: 'Information for Donors',
  language: 'Language',
  footerNote: "Dates and registration are on each entry's page.",
  upcomingEvents: 'Upcoming events',
  opensInNewTab: 'opens in a new tab',

  // Listings
  emptyEvents: 'No events are listed.',
  emptyExhibitions: 'No exhibitions are listed.',
  emptyWorkshops: 'No workshops are listed.',
  emptyArticles: 'No articles are listed.',
  emptyPeople: 'No people are listed.',
  upcomingCount: '{count} upcoming',
  past: 'Past',
  cancelled: 'Cancelled',
  toBeConfirmed: 'To be confirmed',
  soldOut: 'Sold out',
  detailsToFollow: 'Details to follow.',
  circa: 'ca.',
  unnamed: 'Unnamed',
  portraitOf: 'Portrait of {name}',

  // A workshop's page
  termInstructors: 'Instructors',
  termFormat: 'Format',
  termPrice: 'Price',
  termScholarship: 'Scholarship',
  scholarshipFull: 'Full scholarship available',
  termType: 'Type',
  termMaterials: 'Materials',
  termRegistration: 'Registration',
  register: 'Register',
  registerFor: 'Register for {title}',
  openRegistrationForm: 'Open the registration form in a new tab',
  newsletterSignup: 'Newsletter signup',
  formatInPerson: 'In person',
  formatVirtual: 'Virtual',
  formatHybrid: 'In person + virtual',

  // Filtering and sorting a listing
  filterSearch: 'Search',
  filterInstructor: 'Instructor',
  filterType: 'Type',
  filterMaterial: 'Material',
  filterAvailability: 'Availability',
  filterPrice: 'Price',
  filterPast: 'Past workshops',
  includePast: 'Include past',
  priceMin: 'From',
  priceMax: 'To',
  availabilityAll: 'All',
  availabilityOpen: 'Not sold out',
  availabilitySoldOut: 'Sold out',
  sortBy: 'Sort',
  sortDateAsc: 'Date, soonest first',
  sortDateDesc: 'Date, latest first',
  sortPriceAsc: 'Price, low to high',
  sortPriceDesc: 'Price, high to low',
  sortInstructor: 'Instructor, A–Z by last name',
  viewLabel: 'View',
  viewGrid: 'Grid',
  viewList: 'List',
  clearFilters: 'Clear all filters',
  removeFilter: 'Remove filter: {name}',
  resultsOfWorkshops: '{shown} of {total} workshops',
  noWorkshopsMatch: 'No workshops match.',
  colWorkshop: 'Workshop',
  colDates: 'Dates',
  colInstructor: 'Instructor',
  colPrice: 'Price',
  colStatus: 'Status',
} as const;

/** The key of one app string. */
export type TextKey = keyof typeof en;

const es: Record<TextKey, string> = {
  navEvents: 'Eventos',
  navExhibitions: 'Exposiciones',
  navWorkshops: 'Talleres',
  navAbout: 'Acerca de YVML',
  navHistory: 'Historia',
  navNews: 'Noticias y artículos',
  navPress: 'Prensa',
  navStaff: 'Equipo',
  navPeople: 'Personas',
  navGovernance: 'Gobernanza',
  navContact: 'Contáctenos',
  navSupport: 'Apóyenos',
  navDonate: 'Donar',
  navPlannedGiving: 'Donaciones planificadas',
  navCorporateSponsorship: 'Patrocinio corporativo',
  navFoundationSupport: 'Apoyo de fundaciones',
  navGovernmentPartners: 'Socios gubernamentales',
  navDonorInformation: 'Información para donantes',
  language: 'Idioma',
  footerNote: 'Las fechas y la inscripción están en la página de cada entrada.',
  upcomingEvents: 'Próximos eventos',
  opensInNewTab: 'se abre en una pestaña nueva',

  emptyEvents: 'No hay eventos publicados.',
  emptyExhibitions: 'No hay exposiciones publicadas.',
  emptyWorkshops: 'No hay talleres publicados.',
  emptyArticles: 'No hay artículos publicados.',
  emptyPeople: 'No hay personas publicadas.',
  upcomingCount: '{count} próximos',
  past: 'Pasados',
  cancelled: 'Cancelado',
  toBeConfirmed: 'Por confirmar',
  soldOut: 'Agotado',
  detailsToFollow: 'Más detalles próximamente.',
  circa: 'ca.',
  unnamed: 'Sin nombre',
  portraitOf: 'Retrato de {name}',

  termInstructors: 'Instructores',
  termFormat: 'Formato',
  termPrice: 'Precio',
  termScholarship: 'Beca',
  scholarshipFull: 'Beca completa disponible',
  termType: 'Tipo',
  termMaterials: 'Materiales',
  termRegistration: 'Inscripción',
  register: 'Inscribirse',
  registerFor: 'Inscribirse en {title}',
  openRegistrationForm: 'Abrir el formulario de inscripción en una pestaña nueva',
  newsletterSignup: 'Suscripción al boletín',
  formatInPerson: 'Presencial',
  formatVirtual: 'Virtual',
  formatHybrid: 'Presencial + virtual',

  filterSearch: 'Buscar',
  filterInstructor: 'Instructor',
  filterType: 'Tipo',
  filterMaterial: 'Material',
  filterAvailability: 'Disponibilidad',
  filterPrice: 'Precio',
  filterPast: 'Talleres pasados',
  includePast: 'Incluir pasados',
  priceMin: 'Desde',
  priceMax: 'Hasta',
  availabilityAll: 'Todos',
  availabilityOpen: 'Con cupo',
  availabilitySoldOut: 'Agotados',
  sortBy: 'Ordenar',
  sortDateAsc: 'Fecha, más próxima primero',
  sortDateDesc: 'Fecha, más lejana primero',
  sortPriceAsc: 'Precio, de menor a mayor',
  sortPriceDesc: 'Precio, de mayor a menor',
  sortInstructor: 'Instructor, A–Z por apellido',
  viewLabel: 'Vista',
  viewGrid: 'Cuadrícula',
  viewList: 'Lista',
  clearFilters: 'Quitar todos los filtros',
  removeFilter: 'Quitar filtro: {name}',
  resultsOfWorkshops: '{shown} de {total} talleres',
  noWorkshopsMatch: 'Ningún taller coincide.',
  colWorkshop: 'Taller',
  colDates: 'Fechas',
  colInstructor: 'Instructor',
  colPrice: 'Precio',
  colStatus: 'Estado',
};

/** The strings by language. */
export const TEXT: Record<string, Record<TextKey, string>> = { en, es };

/**
 * One app string in the language of the page being rendered, falling back to English.
 *
 * @param key - which string.
 * @param values - what fills each `{hole}`.
 * @returns the text.
 */
export function t(key: TextKey, values?: Record<string, string | number>) {
  const template = (TEXT[activeLocale()] ?? en)[key] ?? en[key];
  return values ? template.replace(/\{(\w+)\}/g, (hole, name: string) => String(values[name] ?? hole)) : template;
}

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
