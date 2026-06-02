export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export const TYPE_BG_COLORS: Record<string, string> = {
  normal: "#F0EFE5",
  fire: "#FDE8D5",
  water: "#D8E5FD",
  electric: "#FEF8D5",
  grass: "#DAFAD5",
  ice: "#D5F5F5",
  fighting: "#FAD5D5",
  poison: "#EDD5FA",
  ground: "#FAF0D5",
  flying: "#E8D5FA",
  psychic: "#FAD5E8",
  bug: "#EEF0D5",
  rock: "#F0EDD5",
  ghost: "#DDD5F0",
  dragon: "#D5D5FD",
  dark: "#E0DBD5",
  steel: "#E8E8F0",
  fairy: "#FAE5EE",
};

export function getPokemonId(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return parseInt(parts[parts.length - 1], 10);
}

export function getOfficialArtwork(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function padId(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

export function formatStatName(name: string): string {
  const map: Record<string, string> = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "Sp.ATK",
    "special-defense": "Sp.DEF",
    speed: "SPD",
  };
  return map[name] ?? name;
}

export function formatHeight(decimeters: number): string {
  const m = decimeters / 10;
  return `${m.toFixed(1)} m`;
}

export function formatWeight(hectograms: number): string {
  const kg = hectograms / 10;
  return `${kg.toFixed(1)} kg`;
}
