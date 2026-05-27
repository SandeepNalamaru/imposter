import type { Category, WordPair } from "../types";

// ID convention: <3-letter category prefix>-<2-digit index>
// Prefixes: gen, ani, foo, his, pla, spi
// IDs MUST be stable across content edits — don't renumber if you swap a pair.

const generic: WordPair[] = [
  { id: "gen-01", civilianWord: "coffee", imposterWord: "tea" },
  { id: "gen-02", civilianWord: "pizza", imposterWord: "calzone" },
  { id: "gen-03", civilianWord: "car", imposterWord: "truck" },
  { id: "gen-04", civilianWord: "guitar", imposterWord: "ukulele" },
  { id: "gen-05", civilianWord: "beach", imposterWord: "lake" },
  { id: "gen-06", civilianWord: "movie", imposterWord: "play" },
  { id: "gen-07", civilianWord: "book", imposterWord: "magazine" },
  { id: "gen-08", civilianWord: "phone", imposterWord: "tablet" },
  { id: "gen-09", civilianWord: "shoes", imposterWord: "boots" },
  { id: "gen-10", civilianWord: "rain", imposterWord: "snow" },
  { id: "gen-11", civilianWord: "letter", imposterWord: "postcard" },
  { id: "gen-12", civilianWord: "couch", imposterWord: "loveseat" },
  { id: "gen-13", civilianWord: "wallet", imposterWord: "purse" },
  { id: "gen-14", civilianWord: "soup", imposterWord: "stew" },
  { id: "gen-15", civilianWord: "river", imposterWord: "stream" },
];

const animals: WordPair[] = [
  { id: "ani-01", civilianWord: "crow", imposterWord: "raven" },
  { id: "ani-02", civilianWord: "cougar", imposterWord: "leopard" },
  { id: "ani-03", civilianWord: "alligator", imposterWord: "crocodile" },
  { id: "ani-04", civilianWord: "dolphin", imposterWord: "shark" },
  { id: "ani-05", civilianWord: "wolf", imposterWord: "coyote" },
  { id: "ani-06", civilianWord: "rabbit", imposterWord: "hare" },
  { id: "ani-07", civilianWord: "turtle", imposterWord: "tortoise" },
  { id: "ani-08", civilianWord: "donkey", imposterWord: "mule" },
  { id: "ani-09", civilianWord: "frog", imposterWord: "toad" },
  { id: "ani-10", civilianWord: "octopus", imposterWord: "squid" },
  { id: "ani-11", civilianWord: "moth", imposterWord: "butterfly" },
  { id: "ani-12", civilianWord: "golden retriever", imposterWord: "pitbull" },
  { id: "ani-13", civilianWord: "hamster", imposterWord: "gerbil" },
  { id: "ani-14", civilianWord: "rat", imposterWord: "mouse" },
  { id: "ani-15", civilianWord: "panther", imposterWord: "jaguar" },
];

const foodAndDrink: WordPair[] = [
  { id: "foo-01", civilianWord: "champagne", imposterWord: "prosecco" },
  { id: "foo-02", civilianWord: "wine", imposterWord: "sangria" },
  { id: "foo-03", civilianWord: "whiskey", imposterWord: "bourbon" },
  { id: "foo-04", civilianWord: "vodka", imposterWord: "gin" },
  { id: "foo-05", civilianWord: "tequila", imposterWord: "mezcal" },
  { id: "foo-06", civilianWord: "espresso", imposterWord: "ristretto" },
  { id: "foo-07", civilianWord: "cheesecake", imposterWord: "flan" },
  { id: "foo-08", civilianWord: "croissant", imposterWord: "danish" },
  { id: "foo-09", civilianWord: "pancake", imposterWord: "crepe" },
  { id: "foo-10", civilianWord: "ramen", imposterWord: "pho" },
  { id: "foo-11", civilianWord: "sushi", imposterWord: "sashimi" },
  { id: "foo-12", civilianWord: "burrito", imposterWord: "chimichanga" },
  { id: "foo-13", civilianWord: "yogurt", imposterWord: "kefir" },
  { id: "foo-14", civilianWord: "cognac", imposterWord: "brandy" },
  { id: "foo-15", civilianWord: "IPA", imposterWord: "pilsner" },
];

const history: WordPair[] = [
  { id: "his-01", civilianWord: "Napoleon", imposterWord: "Julius Caesar" },
  { id: "his-02", civilianWord: "Einstein", imposterWord: "Newton" },
  { id: "his-03", civilianWord: "Cleopatra", imposterWord: "Marie Antoinette" },
  { id: "his-04", civilianWord: "Genghis Khan", imposterWord: "Attila the Hun" },
  { id: "his-05", civilianWord: "Picasso", imposterWord: "Van Gogh" },
  { id: "his-06", civilianWord: "Mozart", imposterWord: "Beethoven" },
  { id: "his-07", civilianWord: "Shakespeare", imposterWord: "Chaucer" },
  { id: "his-08", civilianWord: "Lincoln", imposterWord: "Washington" },
  { id: "his-09", civilianWord: "JFK", imposterWord: "FDR" },
  { id: "his-10", civilianWord: "Gandhi", imposterWord: "Mandela" },
  { id: "his-11", civilianWord: "Joan of Arc", imposterWord: "Boudicca" },
  { id: "his-12", civilianWord: "Galileo", imposterWord: "Copernicus" },
  { id: "his-13", civilianWord: "Alexander the Great", imposterWord: "Hannibal" },
  { id: "his-14", civilianWord: "Marie Curie", imposterWord: "Ada Lovelace" },
  { id: "his-15", civilianWord: "Henry VIII", imposterWord: "Louis XIV" },
];

const places: WordPair[] = [
  { id: "pla-01", civilianWord: "Paris", imposterWord: "Vienna" },
  { id: "pla-02", civilianWord: "Rome", imposterWord: "Athens" },
  { id: "pla-03", civilianWord: "Tokyo", imposterWord: "Seoul" },
  { id: "pla-04", civilianWord: "Bali", imposterWord: "Phuket" },
  { id: "pla-05", civilianWord: "Las Vegas", imposterWord: "Atlantic City" },
  { id: "pla-06", civilianWord: "Dubai", imposterWord: "Doha" },
  { id: "pla-07", civilianWord: "Amsterdam", imposterWord: "Copenhagen" },
  { id: "pla-08", civilianWord: "Mexico City", imposterWord: "Buenos Aires" },
  { id: "pla-09", civilianWord: "Iceland", imposterWord: "Norway" },
  { id: "pla-10", civilianWord: "Cancún", imposterWord: "Tulum" },
  { id: "pla-11", civilianWord: "Hawaii", imposterWord: "Fiji" },
  { id: "pla-12", civilianWord: "Cape Town", imposterWord: "Marrakech" },
  { id: "pla-13", civilianWord: "Edinburgh", imposterWord: "Dublin" },
  { id: "pla-14", civilianWord: "Hong Kong", imposterWord: "Singapore" },
  { id: "pla-15", civilianWord: "Aspen", imposterWord: "Whistler" },
];

const spicy: WordPair[] = [
  { id: "spi-01", civilianWord: "Tinder", imposterWord: "Grindr" },
  { id: "spi-02", civilianWord: "Hinge", imposterWord: "Bumble" },
  { id: "spi-03", civilianWord: "one-night stand", imposterWord: "situationship" },
  { id: "spi-04", civilianWord: "ex", imposterWord: "situationship" },
  { id: "spi-05", civilianWord: "first date", imposterWord: "blind date" },
  { id: "spi-06", civilianWord: "wine mom", imposterWord: "frat bro" },
  { id: "spi-07", civilianWord: "finance bro", imposterWord: "tech bro" },
  { id: "spi-08", civilianWord: "gym rat", imposterWord: "yoga girl" },
  { id: "spi-09", civilianWord: "hangover", imposterWord: "blackout" },
  { id: "spi-10", civilianWord: "tequila shot", imposterWord: "jäger bomb" },
  { id: "spi-11", civilianWord: "wine drunk", imposterWord: "tequila drunk" },
  { id: "spi-12", civilianWord: "edible", imposterWord: "joint" },
  { id: "spi-13", civilianWord: "molly", imposterWord: "shrooms" },
  { id: "spi-14", civilianWord: "dive bar", imposterWord: "speakeasy" },
  { id: "spi-15", civilianWord: "afters", imposterWord: "pre-game" },
];

export const CATEGORIES: Category[] = [
  { name: "Generic", pairs: generic },
  { name: "Animals", pairs: animals },
  { name: "Food & Drink", pairs: foodAndDrink },
  { name: "History & Famous People", pairs: history },
  { name: "Places & Travel", pairs: places },
  { name: "Spicy", pairs: spicy },
];

// Convenience: flat list of all 90 pairs (used by Random selection).
export const ALL_PAIRS: WordPair[] = CATEGORIES.flatMap((c) => c.pairs);

// Lookup helper used by resume logic and by Win screen rendering.
export function getPairById(id: string): WordPair | undefined {
  return ALL_PAIRS.find((p) => p.id === id);
}

// TEMP — remove once all screens are migrated in Phase 2.
export const FAKE_PLAYERS = ["Alex", "Sam", "Jordan", "Riley", "Taylor"];
export const FAKE_WORD = "eagle";
export const FAKE_PAIR = { civilianWord: "eagle", imposterWord: "pigeon" };