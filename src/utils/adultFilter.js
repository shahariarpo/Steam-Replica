// Steam Adult Content & NSFW Filter Utility

// Common adult, hentai, and explicit NSFW keyword patterns
const ADULT_KEYWORD_PATTERNS = [
  /\bhentai\w*/i,
  /\bnsfw\b/i,
  /\bporn\w*/i,
  /\berotic\w*/i,
  /\becchi\b/i,
  /\buncensored\b/i,
  /\b18\+\b/i,
  /\badult only\b/i,
  /\badults only\b/i,
  /\bsex\b/i,
  /\bsexy\b/i,
  /\bsexual\w*/i,
  /\bboobs\b/i,
  /\boppai\b/i,
  /\blewd\w*/i,
  /\bfutanari\b/i,
  /\bmilf\b/i,
  /\bsuccubus\w*/i,
  /\bnude\b/i,
  /\bnudity\b/i,
  /\blust\w*/i,
  /\bstrip poker\b/i,
  /\bstripclub\b/i,
  /\bsister leticia\b/i,
  /\bwaifu strip\b/i,
  /\bafk waifu\b/i,
  /\byaoi\b/i,
  /\byuri\b/i,
  /\bdoujin\w*/i,
  /\bincest\w*/i,
  /\bmasturbat\w*/i,
  /\bhardcore sex\b/i
];

// Steam Content Descriptor IDs:
// 1: Some Nudity or Sexual Content
// 2: Frequent Violence or Gore (Standard M-rating, not filtered by adult sex filter)
// 3: Adult Only Sexual Content
// 4: Frequent Nudity or Sexual Content
// 5: General Mature Content
const ADULT_CONTENT_DESCRIPTOR_IDS = [1, 3, 4];

const ADULT_GENRE_NAMES = [
  'nudity',
  'sexual content',
  'hentai',
  'erotic',
  'nsfw',
  'adult only',
  'ecchi',
  'mature sexual content'
];

/**
 * Determines whether a given game item contains adult/NSFW content.
 * @param {Object} game - The game data object from featured, categories, or appdetails API.
 * @returns {boolean} True if the game is flagged as adult content.
 */
export function isAdultGame(game) {
  if (!game) return false;

  // 1. Check Steam Content Descriptors (from appdetails or featured data)
  if (game.content_descriptors) {
    const ids = game.content_descriptors.ids || [];
    if (ids.some((id) => ADULT_CONTENT_DESCRIPTOR_IDS.includes(id))) {
      return true;
    }

    const notes = (game.content_descriptors.notes || '').toLowerCase();
    if (
      notes.includes('sex acts') ||
      notes.includes('sexual content') ||
      notes.includes('adult audiences') ||
      notes.includes('non-consensual sex') ||
      notes.includes('interspecies sex') ||
      notes.includes('nudity') ||
      notes.includes('hentai')
    ) {
      return true;
    }
  }

  // 2. Check Genres / Categories
  if (game.genres && Array.isArray(game.genres)) {
    const hasAdultGenre = game.genres.some((g) => {
      const desc = (g.description || g.name || '').toLowerCase();
      return ADULT_GENRE_NAMES.some((keyword) => desc.includes(keyword));
    });
    if (hasAdultGenre) return true;
  }

  if (game.categories && Array.isArray(game.categories)) {
    const hasAdultCat = game.categories.some((c) => {
      const desc = (c.description || c.name || '').toLowerCase();
      return ADULT_GENRE_NAMES.some((keyword) => desc.includes(keyword));
    });
    if (hasAdultCat) return true;
  }

  // 3. Check Game Name / Title regex patterns
  const name = game.name || '';
  if (ADULT_KEYWORD_PATTERNS.some((pattern) => pattern.test(name))) {
    return true;
  }

  // 4. Check Short Description if available
  const shortDesc = game.short_description || '';
  if (
    shortDesc.includes('18+ only') ||
    shortDesc.includes('Adults Only') ||
    shortDesc.includes('explicit sexual') ||
    shortDesc.includes('uncensored patch')
  ) {
    return true;
  }

  return false;
}

/**
 * Filters an array of games, removing adult titles if filtering is active.
 * @param {Array} games - Array of game objects.
 * @param {boolean} filterEnabled - Whether the adult filter is active (default true).
 * @returns {Array} Filtered list of games.
 */
export function filterAdultGames(games = [], filterEnabled = true) {
  if (!Array.isArray(games)) return [];
  if (!filterEnabled) return games;
  return games.filter((game) => !isAdultGame(game));
}
