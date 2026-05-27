export type WordPair = {
  id: string
  a: string
  b: string
}

export type CategoryId =
  | 'generic'
  | 'animals'
  | 'food'
  | 'history'
  | 'places'
  | 'spicy'
  | 'random'

export type Category = {
  id: CategoryId
  name: string
  pairs: WordPair[]
}

const generic: WordPair[] = [
  { id: 'gen-01', a: 'coffee', b: 'tea' },
  { id: 'gen-02', a: 'pizza', b: 'calzone' },
  { id: 'gen-03', a: 'car', b: 'truck' },
  { id: 'gen-04', a: 'guitar', b: 'ukulele' },
  { id: 'gen-05', a: 'beach', b: 'lake' },
  { id: 'gen-06', a: 'movie', b: 'play' },
  { id: 'gen-07', a: 'book', b: 'magazine' },
  { id: 'gen-08', a: 'phone', b: 'tablet' },
  { id: 'gen-09', a: 'shoes', b: 'boots' },
  { id: 'gen-10', a: 'rain', b: 'snow' },
  { id: 'gen-11', a: 'letter', b: 'postcard' },
  { id: 'gen-12', a: 'couch', b: 'loveseat' },
  { id: 'gen-13', a: 'wallet', b: 'purse' },
  { id: 'gen-14', a: 'soup', b: 'stew' },
  { id: 'gen-15', a: 'river', b: 'stream' },
]

const animals: WordPair[] = [
  { id: 'ani-01', a: 'crow', b: 'raven' },
  { id: 'ani-02', a: 'cougar', b: 'leopard' },
  { id: 'ani-03', a: 'alligator', b: 'crocodile' },
  { id: 'ani-04', a: 'dolphin', b: 'shark' },
  { id: 'ani-05', a: 'wolf', b: 'coyote' },
  { id: 'ani-06', a: 'rabbit', b: 'hare' },
  { id: 'ani-07', a: 'turtle', b: 'tortoise' },
  { id: 'ani-08', a: 'donkey', b: 'mule' },
  { id: 'ani-09', a: 'frog', b: 'toad' },
  { id: 'ani-10', a: 'octopus', b: 'squid' },
  { id: 'ani-11', a: 'moth', b: 'butterfly' },
  { id: 'ani-12', a: 'golden retriever', b: 'pitbull' },
  { id: 'ani-13', a: 'hamster', b: 'gerbil' },
  { id: 'ani-14', a: 'rat', b: 'mouse' },
  { id: 'ani-15', a: 'panther', b: 'jaguar' },
]

const food: WordPair[] = [
  { id: 'foo-01', a: 'champagne', b: 'prosecco' },
  { id: 'foo-02', a: 'wine', b: 'sangria' },
  { id: 'foo-03', a: 'whiskey', b: 'bourbon' },
  { id: 'foo-04', a: 'vodka', b: 'gin' },
  { id: 'foo-05', a: 'tequila', b: 'mezcal' },
  { id: 'foo-06', a: 'espresso', b: 'ristretto' },
  { id: 'foo-07', a: 'cheesecake', b: 'flan' },
  { id: 'foo-08', a: 'croissant', b: 'danish' },
  { id: 'foo-09', a: 'pancake', b: 'crepe' },
  { id: 'foo-10', a: 'ramen', b: 'pho' },
  { id: 'foo-11', a: 'sushi', b: 'sashimi' },
  { id: 'foo-12', a: 'burrito', b: 'chimichanga' },
  { id: 'foo-13', a: 'yogurt', b: 'kefir' },
  { id: 'foo-14', a: 'cognac', b: 'brandy' },
  { id: 'foo-15', a: 'IPA', b: 'pilsner' },
]

const history: WordPair[] = [
  { id: 'his-01', a: 'Napoleon', b: 'Julius Caesar' },
  { id: 'his-02', a: 'Einstein', b: 'Newton' },
  { id: 'his-03', a: 'Cleopatra', b: 'Marie Antoinette' },
  { id: 'his-04', a: 'Genghis Khan', b: 'Attila the Hun' },
  { id: 'his-05', a: 'Picasso', b: 'Van Gogh' },
  { id: 'his-06', a: 'Mozart', b: 'Beethoven' },
  { id: 'his-07', a: 'Shakespeare', b: 'Chaucer' },
  { id: 'his-08', a: 'Lincoln', b: 'Washington' },
  { id: 'his-09', a: 'JFK', b: 'FDR' },
  { id: 'his-10', a: 'Gandhi', b: 'Mandela' },
  { id: 'his-11', a: 'Joan of Arc', b: 'Boudicca' },
  { id: 'his-12', a: 'Galileo', b: 'Copernicus' },
  { id: 'his-13', a: 'Alexander the Great', b: 'Hannibal' },
  { id: 'his-14', a: 'Marie Curie', b: 'Ada Lovelace' },
  { id: 'his-15', a: 'Henry VIII', b: 'Louis XIV' },
]

const places: WordPair[] = [
  { id: 'pla-01', a: 'Paris', b: 'Vienna' },
  { id: 'pla-02', a: 'Rome', b: 'Athens' },
  { id: 'pla-03', a: 'Tokyo', b: 'Seoul' },
  { id: 'pla-04', a: 'Bali', b: 'Phuket' },
  { id: 'pla-05', a: 'Las Vegas', b: 'Atlantic City' },
  { id: 'pla-06', a: 'Dubai', b: 'Doha' },
  { id: 'pla-07', a: 'Amsterdam', b: 'Copenhagen' },
  { id: 'pla-08', a: 'Mexico City', b: 'Buenos Aires' },
  { id: 'pla-09', a: 'Iceland', b: 'Norway' },
  { id: 'pla-10', a: 'Cancún', b: 'Tulum' },
  { id: 'pla-11', a: 'Hawaii', b: 'Fiji' },
  { id: 'pla-12', a: 'Cape Town', b: 'Marrakech' },
  { id: 'pla-13', a: 'Edinburgh', b: 'Dublin' },
  { id: 'pla-14', a: 'Hong Kong', b: 'Singapore' },
  { id: 'pla-15', a: 'Aspen', b: 'Whistler' },
]

const spicy: WordPair[] = [
  { id: 'spi-01', a: 'Tinder', b: 'Grindr' },
  { id: 'spi-02', a: 'Hinge', b: 'Bumble' },
  { id: 'spi-03', a: 'one-night stand', b: 'situationship' },
  { id: 'spi-04', a: 'ex', b: 'situationship' },
  { id: 'spi-05', a: 'first date', b: 'blind date' },
  { id: 'spi-06', a: 'wine mom', b: 'frat bro' },
  { id: 'spi-07', a: 'finance bro', b: 'tech bro' },
  { id: 'spi-08', a: 'gym rat', b: 'yoga girl' },
  { id: 'spi-09', a: 'hangover', b: 'blackout' },
  { id: 'spi-10', a: 'tequila shot', b: 'jäger bomb' },
  { id: 'spi-11', a: 'wine drunk', b: 'tequila drunk' },
  { id: 'spi-12', a: 'edible', b: 'joint' },
  { id: 'spi-13', a: 'molly', b: 'shrooms' },
  { id: 'spi-14', a: 'dive bar', b: 'speakeasy' },
  { id: 'spi-15', a: 'afters', b: 'pre-game' },
]

export const CATEGORIES: Category[] = [
  { id: 'generic', name: 'Generic', pairs: generic },
  { id: 'animals', name: 'Animals', pairs: animals },
  { id: 'food', name: 'Food & Drink', pairs: food },
  { id: 'history', name: 'History & Famous People', pairs: history },
  { id: 'places', name: 'Places & Travel', pairs: places },
  { id: 'spicy', name: 'Spicy', pairs: spicy },
  { id: 'random', name: 'Random', pairs: [] }, // Random pulls from all in Conv 6
]

// M1 hardcoded fake game data
export const FAKE_PLAYERS = ['Alex', 'Sam', 'Jordan', 'Riley', 'Casey']
export const FAKE_WORD = 'eagle'
export const FAKE_PAIR = { civilian: 'eagle', imposter: 'pigeon' }