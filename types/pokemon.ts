import { z } from "zod";

const NameUrlSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const PokemonListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(NameUrlSchema),
});

export type PokemonList = z.infer<typeof PokemonListSchema>;
export type PokemonListItem = z.infer<typeof NameUrlSchema>;

export const PokemonDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  base_experience: z.number().nullable(),
  sprites: z.object({
    front_default: z.string().nullable(),
    other: z.object({
      "official-artwork": z.object({
        front_default: z.string().nullable(),
      }),
    }).optional(),
  }),
  types: z.array(
    z.object({
      slot: z.number(),
      type: NameUrlSchema,
    })
  ),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      effort: z.number(),
      stat: NameUrlSchema,
    })
  ),
  abilities: z.array(
    z.object({
      is_hidden: z.boolean(),
      slot: z.number(),
      ability: NameUrlSchema,
    })
  ),
});

export type PokemonDetail = z.infer<typeof PokemonDetailSchema>;
