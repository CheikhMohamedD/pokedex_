import { z } from "zod";

// ── List ──────────────────────────────────────────────────────────────────────

export const PokemonListItemSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const PokemonListResponseSchema = z.object({
  results: z.array(PokemonListItemSchema),
});

export type Pokemon = {
  id: number;
  name: string;
  imageUrl: string;
};

// ── Detail ────────────────────────────────────────────────────────────────────

export const PokemonStatSchema = z.object({
  base_stat: z.number(),
  stat: z.object({ name: z.string() }),
});

export const PokemonTypeSlotSchema = z.object({
  type: z.object({ name: z.string() }),
});

export const PokemonAbilitySlotSchema = z.object({
  ability: z.object({ name: z.string() }),
  is_hidden: z.boolean(),
});

export const PokemonDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  types: z.array(PokemonTypeSlotSchema),
  stats: z.array(PokemonStatSchema),
  abilities: z.array(PokemonAbilitySlotSchema),
  sprites: z.object({
    other: z.object({
      "official-artwork": z.object({
        front_default: z.string().nullable(),
      }),
    }),
  }),
});

export type PokemonDetail = z.infer<typeof PokemonDetailSchema>;
