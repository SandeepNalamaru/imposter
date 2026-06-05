import type { Category, WordPair } from "../types";

// ID convention: <3-letter category prefix>-<2-digit index>
// Prefixes: gen, ani, foo, fam, pla, spi, tec
// IDs MUST be stable across content edits — don't renumber if you swap a pair.

const generic: WordPair[] = [
  { id: "gen-01", civilianWord: "coffee", imposterWord: "tea" },
  { id: "gen-02", civilianWord: "Spotify", imposterWord: "Apple Music" },
  { id: "gen-03", civilianWord: "Uber", imposterWord: "Lyft" },
  { id: "gen-04", civilianWord: "concert", imposterWord: "festival" },
  { id: "gen-05", civilianWord: "apartment", imposterWord: "condo" },
  { id: "gen-06", civilianWord: "hoodie", imposterWord: "crewneck" },
  { id: "gen-07", civilianWord: "phone", imposterWord: "tablet" },
  { id: "gen-08", civilianWord: "car", imposterWord: "truck" },
  { id: "gen-09", civilianWord: "movie", imposterWord: "play" },
  { id: "gen-10", civilianWord: "book", imposterWord: "magazine" },
  { id: "gen-11", civilianWord: "pizza", imposterWord: "calzone" },
  { id: "gen-12", civilianWord: "beach", imposterWord: "lake" },
  { id: "gen-13", civilianWord: "guitar", imposterWord: "ukulele" },
  { id: "gen-14", civilianWord: "wallet", imposterWord: "purse" },
  { id: "gen-15", civilianWord: "rain", imposterWord: "snow" },
];

const animals: WordPair[] = [
  { id: "ani-01", civilianWord: "crow", imposterWord: "raven" },
  { id: "ani-02", civilianWord: "alligator", imposterWord: "crocodile" },
  { id: "ani-03", civilianWord: "wolf", imposterWord: "coyote" },
  { id: "ani-04", civilianWord: "turtle", imposterWord: "tortoise" },
  { id: "ani-05", civilianWord: "octopus", imposterWord: "squid" },
  { id: "ani-06", civilianWord: "frog", imposterWord: "toad" },
  { id: "ani-07", civilianWord: "rat", imposterWord: "mouse" },
  { id: "ani-08", civilianWord: "alpaca", imposterWord: "llama" },
  { id: "ani-09", civilianWord: "seal", imposterWord: "sea lion" },
  { id: "ani-10", civilianWord: "golden retriever", imposterWord: "pitbull" },
  { id: "ani-11", civilianWord: "husky", imposterWord: "german shepherd" },
  { id: "ani-12", civilianWord: "cheetah", imposterWord: "leopard" },
  { id: "ani-13", civilianWord: "rabbit", imposterWord: "hare" },
  { id: "ani-14", civilianWord: "moth", imposterWord: "butterfly" },
  { id: "ani-15", civilianWord: "panther", imposterWord: "jaguar" },
];

const foodAndDrink: WordPair[] = [
  { id: "foo-01", civilianWord: "ramen", imposterWord: "pho" },
  { id: "foo-02", civilianWord: "sushi", imposterWord: "sashimi" },
  { id: "foo-03", civilianWord: "tequila", imposterWord: "mezcal" },
  { id: "foo-04", civilianWord: "whiskey", imposterWord: "bourbon" },
  { id: "foo-05", civilianWord: "matcha", imposterWord: "chai" },
  { id: "foo-06", civilianWord: "boba", imposterWord: "smoothie" },
  { id: "foo-07", civilianWord: "latte", imposterWord: "flat white" },
  { id: "foo-08", civilianWord: "poke bowl", imposterWord: "burrito bowl" },
  { id: "foo-09", civilianWord: "Korean BBQ", imposterWord: "hot pot" },
  { id: "foo-10", civilianWord: "croissant", imposterWord: "danish" },
  { id: "foo-11", civilianWord: "pancake", imposterWord: "crepe" },
  { id: "foo-12", civilianWord: "espresso", imposterWord: "ristretto" },
  { id: "foo-13", civilianWord: "cheesecake", imposterWord: "flan" },
  { id: "foo-14", civilianWord: "yogurt", imposterWord: "kefir" },
  { id: "foo-15", civilianWord: "IPA", imposterWord: "pilsner" },
];

const famousPeople: WordPair[] = [
  { id: "fam-01", civilianWord: "Messi", imposterWord: "Ronaldo" },
  { id: "fam-02", civilianWord: "LeBron", imposterWord: "Steph Curry" },
  { id: "fam-03", civilianWord: "Taylor Swift", imposterWord: "Olivia Rodrigo" },
  { id: "fam-04", civilianWord: "Drake", imposterWord: "Travis Scott" },
  { id: "fam-05", civilianWord: "MrBeast", imposterWord: "Logan Paul" },
  { id: "fam-06", civilianWord: "Elon Musk", imposterWord: "Mark Zuckerberg" },
  { id: "fam-07", civilianWord: "Zendaya", imposterWord: "Sydney Sweeney" },
  { id: "fam-08", civilianWord: "Tom Holland", imposterWord: "Timothee Chalamet" },
  { id: "fam-09", civilianWord: "The Weeknd", imposterWord: "Post Malone" },
  { id: "fam-10", civilianWord: "Sabrina Carpenter", imposterWord: "Dua Lipa" },
  { id: "fam-11", civilianWord: "Kendrick Lamar", imposterWord: "J. Cole" },
  { id: "fam-12", civilianWord: "Joe Rogan", imposterWord: "Lex Fridman" },
  { id: "fam-13", civilianWord: "Ryan Reynolds", imposterWord: "Ryan Gosling" },
  { id: "fam-14", civilianWord: "Jennifer Lawrence", imposterWord: "Emma Stone" },
  { id: "fam-15", civilianWord: "Pedro Pascal", imposterWord: "Oscar Isaac" },
];

const places: WordPair[] = [
  { id: "pla-01", civilianWord: "Tokyo", imposterWord: "Seoul" },
  { id: "pla-02", civilianWord: "Bali", imposterWord: "Phuket" },
  { id: "pla-03", civilianWord: "Hong Kong", imposterWord: "Singapore" },
  { id: "pla-04", civilianWord: "Miami", imposterWord: "Las Vegas" },
  { id: "pla-05", civilianWord: "Ibiza", imposterWord: "Mykonos" },
  { id: "pla-06", civilianWord: "Barcelona", imposterWord: "Lisbon" },
  { id: "pla-07", civilianWord: "Cabo", imposterWord: "Cancún" },
  { id: "pla-08", civilianWord: "Lake Tahoe", imposterWord: "Aspen" },
  { id: "pla-09", civilianWord: "Paris", imposterWord: "Vienna" },
  { id: "pla-10", civilianWord: "Rome", imposterWord: "Athens" },
  { id: "pla-11", civilianWord: "Dubai", imposterWord: "Doha" },
  { id: "pla-12", civilianWord: "Amsterdam", imposterWord: "Copenhagen" },
  { id: "pla-13", civilianWord: "Iceland", imposterWord: "Norway" },
  { id: "pla-14", civilianWord: "Edinburgh", imposterWord: "Dublin" },
  { id: "pla-15", civilianWord: "Mexico City", imposterWord: "Buenos Aires" },
];

const spicy: WordPair[] = [
  { id: "spi-01", civilianWord: "Tinder", imposterWord: "Grindr" },
  { id: "spi-02", civilianWord: "Hinge", imposterWord: "Bumble" },
  { id: "spi-03", civilianWord: "situationship", imposterWord: "talking stage" },
  { id: "spi-04", civilianWord: "soft launch", imposterWord: "hard launch" },
  { id: "spi-05", civilianWord: "red flag", imposterWord: "ick" },
  { id: "spi-06", civilianWord: "sneaky link", imposterWord: "friends with benefits" },
  { id: "spi-07", civilianWord: "clubbing", imposterWord: "rave" },
  { id: "spi-08", civilianWord: "finance bro", imposterWord: "tech bro" },
  { id: "spi-09", civilianWord: "gym rat", imposterWord: "yoga girl" },
  { id: "spi-10", civilianWord: "hangover", imposterWord: "blackout" },
  { id: "spi-11", civilianWord: "wine drunk", imposterWord: "tequila drunk" },
  { id: "spi-12", civilianWord: "dive bar", imposterWord: "speakeasy" },
  { id: "spi-13", civilianWord: "afters", imposterWord: "pre-game" },
  { id: "spi-14", civilianWord: "ghosting", imposterWord: "breadcrumbing" },
  { id: "spi-15", civilianWord: "ex", imposterWord: "rebound" },
];

const tech: WordPair[] = [
  { id: "tec-01", civilianWord: "ChatGPT", imposterWord: "Claude" },
  { id: "tec-02", civilianWord: "Cursor", imposterWord: "Windsurf" },
  { id: "tec-03", civilianWord: "Notion", imposterWord: "Obsidian" },
  { id: "tec-04", civilianWord: "Figma", imposterWord: "Canva" },
  { id: "tec-05", civilianWord: "iPhone", imposterWord: "Galaxy" },
  { id: "tec-06", civilianWord: "MacBook", imposterWord: "Surface" },
  { id: "tec-07", civilianWord: "Discord", imposterWord: "Slack" },
  { id: "tec-08", civilianWord: "Reddit", imposterWord: "X" },
  { id: "tec-09", civilianWord: "DoorDash", imposterWord: "Uber Eats" },
  { id: "tec-10", civilianWord: "Airbnb", imposterWord: "Vrbo" },
  { id: "tec-11", civilianWord: "Zoom", imposterWord: "Google Meet" },
  { id: "tec-12", civilianWord: "Chrome", imposterWord: "Safari" },
  { id: "tec-13", civilianWord: "n8n", imposterWord: "Zapier" },
  { id: "tec-14", civilianWord: "GitHub", imposterWord: "GitLab" },
  { id: "tec-15", civilianWord: "Tesla", imposterWord: "Rivian" },
];

export const CATEGORIES: Category[] = [
  { name: "Generic", pairs: generic },
  { name: "Animals", pairs: animals },
  { name: "Food & Drink", pairs: foodAndDrink },
  { name: "Famous People", pairs: famousPeople },
  { name: "Places & Travel", pairs: places },
  { name: "Spicy", pairs: spicy },
  { name: "Tech", pairs: tech },
];

// Convenience: flat list of all 105 pairs (used by Random selection).
export const ALL_PAIRS: WordPair[] = CATEGORIES.flatMap((c) => c.pairs);

// Lookup helper used by resume logic and by Win screen rendering.
export function getPairById(id: string): WordPair | undefined {
  return ALL_PAIRS.find((p) => p.id === id);
}