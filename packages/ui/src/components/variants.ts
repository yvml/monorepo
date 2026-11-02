/** A generated recipe function, which carries its variant map. */
type RecipeWithVariants = { variantMap: Record<string, readonly unknown[]> };

/**
 * The values one variant of a Panda recipe accepts, read from the generated recipe, so a primitive's prop type can
 * never drift from the recipe. Use it as `VariantOf<typeof list, 'gap'>`.
 */
export type VariantOf<
  Recipe extends RecipeWithVariants,
  Key extends keyof Recipe['variantMap'],
> = Recipe['variantMap'][Key][number];

/**
 * A name the project declares in its config, such as a hue or a section tone. The generated recipe types list only the
 * names of the library's own theme, so a declared name is passed through here to be accepted by any variant.
 */
export const declared = (name: string): never => name as never;
