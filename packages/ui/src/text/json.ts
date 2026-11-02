/** Any JSON value, which is all a server function may send to the browser. */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * A Portable Text block as it travels from a server function: JSON, typed loosely so the framework accepts it as a
 * return value. Cast it to `PortableTextBlock[]` where it is rendered.
 */
export type TextBlock = { _type: string; _key?: string; [key: string]: JsonValue | undefined };
