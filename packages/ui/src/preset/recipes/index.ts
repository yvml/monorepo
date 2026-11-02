import type { TypeSystem } from '../type-scale';
import { absoluteCenter } from './absolute-center';
import { accordion } from './accordion';
import { adminBar, fieldStatus, pageBar, signInForm, viewSwitch } from './admin';
import { badge } from './badge';
import { codeBlock, disclosure, quote, timeline } from './blocks';
import { browseNav, letterBar, listHeader, rangeColumns, rangeNav, rangeSections } from './browse';
import { button } from './button';
import { featureCard, tile } from './cards';
import { checkbox } from './checkbox';
import { breadcrumbs, jumpNav, siteFooter, siteNav } from './chrome';
import { combobox } from './combobox';
import { dialog } from './dialog';
import { field } from './field';
import { fieldRow } from './field-row';
import { fieldset } from './fieldset';
import { group } from './group';
import { hero } from './hero';
import { icon } from './icon';
import { input } from './input';
import {
  nameList,
  columnCell,
  columnGrid,
  columnList,
  fullRow,
  inset,
  itemList,
  layout,
  layoutStack,
  layoutWrap,
  measure,
  mediaRow,
  ruled,
  splitGrid,
  termList,
  termRow,
  tileGrid,
} from './layout';
import { link } from './link';
import { countedList, datedList, expandableRow, listFilter, rowDrawer } from './lists';
import { figure, picture, videoFrame } from './media';
import { createPageRoles } from './page-roles';
import { pageLayout, pageText } from './page-text';
import { cardItem, centeredLines, pageColumn, pageHeader, skipLink } from './pages';
import { pagination } from './pagination';
import { player } from './player';
import { popover } from './popover';
import { radioGroup } from './radio-group';
import { createRoles } from './roles';
import { chip, filterRow, searchField, typeahead } from './search';
import { section, sectionGroup } from './section';
import { select } from './select';
import { spinner } from './spinner';
import { statusBadge } from './status';
import { styleguide } from './styleguide';
import { table } from './table';
import { playableRow, scrollX, tableCell } from './table-parts';
import { tabs } from './tabs';
import { recordHeader } from './record';
import { hue, plate, scrollList } from './tile';
import { toast } from './toast';
import { toggleGroup } from './toggle-group';
import { tooltip } from './tooltip';

/**
 * Every recipe, built for a type system. The recipes that set text take the type system; the rest are static.
 *
 * @param t - the type system of a design.
 * @returns the recipes and slot recipes.
 */
/** The names a project gave its colors: the label hues (`categorical`) and the section tones (`wash`). */
export type ColorNames = { hues: readonly string[]; tones: readonly string[] };

export function createRecipes(t: TypeSystem, names: ColorNames = { hues: [], tones: [] }) {
  const { label, numeral, text, title } = createRoles(t);
  return {
    recipes: {
      ...createPageRoles(t),
      scrollX,
      tableCell: tableCell(t),
      playableRow,
      itemList,
      layoutStack,
      columnGrid,
      columnCell,
      nameList: nameList(t),
      layoutWrap,
      measure,
      ruled,
      mediaRow,
      inset,
      layout,
      fullRow,
      termList: termList(t),
      termRow,
      columnList: columnList(t),
      splitGrid,
      tileGrid,
      listFilter: listFilter(t),
      quote,
      codeBlock: codeBlock(t),
      timeline: timeline(t),
      disclosure: disclosure(t),
      picture,
      figure,
      videoFrame,
      sectionGroup,
      hue: hue(names.hues),
      scrollList,
      chip: chip(t),
      pageColumn,
      pageHeader,
      cardItem,
      centeredLines,
      skipLink: skipLink(t),
      pageBar,
      adminBar,
      fieldStatus,
      signInForm,
      statusBadge: statusBadge(t),
      absoluteCenter,
      badge: badge(t),
      button: button(t),
      fieldRow,
      group,
      icon,
      input,
      label,
      link: link(t),
      numeral,
      spinner,
      text,
      title,
    },
    slotRecipes: {
      combobox,
      styleguide: styleguide(t),
      countedList: countedList(t),
      recordHeader: recordHeader(t),
      expandableRow: expandableRow(t),
      rowDrawer,
      datedList: datedList(t),
      section: section(t, names.tones),
      plate: plate(t),
      featureCard: featureCard(t),
      tile: tile(t),
      pageText: pageText(t),
      pageLayout: pageLayout(t),
      jumpNav: jumpNav(t),
      breadcrumbs: breadcrumbs(t),
      siteNav: siteNav(t),
      siteFooter: siteFooter(t),
      player: player(t),
      searchField: searchField(t),
      filterRow: filterRow(t),
      typeahead: typeahead(t),
      hero: hero(t),
      viewSwitch,
      browseNav: browseNav(t),
      rangeColumns: rangeColumns(t),
      rangeNav: rangeNav(t),
      rangeSections: rangeSections(t),
      letterBar: letterBar(t),
      listHeader: listHeader(t),
      accordion,
      checkbox,
      dialog,
      field,
      fieldset,
      popover,
      radioGroup,
      select,
      pagination,
      table: table(t),
      tabs,
      toast,
      toggleGroup,
      tooltip,
    },
  };
}
