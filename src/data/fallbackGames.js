// Fallback mock data used when the Steam API is unreachable
// Prices are in cents (e.g. 5999 = $59.99), matching Steam's format.

export const fallbackFeatured = {
  large_capsules: [
    {
      id: 1245620,
      type: 0,
      name: "ELDEN RING",
      discounted: true,
      discount_percent: 40,
      original_price: 5999,
      final_price: 3599,
      currency: "USD",
      large_capsule_image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_616x353.jpg",
      header_image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
      windows_available: true,
      mac_available: false,
      linux_available: false,
    },
    {
      id: 1091500,
      type: 0,
      name: "Cyberpunk 2077",
      discounted: true,
      discount_percent: 50,
      original_price: 5999,
      final_price: 2999,
      currency: "USD",
      large_capsule_image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/capsule_616x353.jpg",
      header_image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
      windows_available: true,
      mac_available: false,
      linux_available: false,
    },
    {
      id: 730,
      type: 0,
      name: "Counter-Strike 2",
      discounted: false,
      discount_percent: 0,
      original_price: 0,
      final_price: 0,
      currency: "USD",
      large_capsule_image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/capsule_616x353.jpg",
      header_image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg",
      windows_available: true,
      mac_available: true,
      linux_available: true,
    },
  ],
  featured_win: [],
};

export const fallbackCategories = {
  specials: {
    id: "cat_specials",
    name: "Specials",
    items: [
      {
        id: 1245620,
        type: 0,
        name: "ELDEN RING",
        discounted: true,
        discount_percent: 40,
        original_price: 5999,
        final_price: 3599,
        currency: "USD",
        large_capsule_image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_616x353.jpg",
        small_capsule_image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_184x69.jpg",
        header_image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
        windows_available: true,
        mac_available: false,
        linux_available: false,
      },
    ],
  },
  top_sellers: {
    id: "cat_topsellers",
    name: "Top Sellers",
    items: [],
  },
  new_releases: {
    id: "cat_newreleases",
    name: "New Releases",
    items: [],
  },
  coming_soon: {
    id: "cat_comingsoon",
    name: "Coming Soon",
    items: [],
  },
};
