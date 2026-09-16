# 🎮 Steam Store Replica

A modern, high-fidelity replica of the **Valve Steam Store** built with **React 19**, **Vite**, and **Tailwind CSS v4**. Experience real-time game data, dynamic carousels, responsive game grids, shopping cart persistence, and intelligent adult content filtering with authentic Steam aesthetics.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-v8.3-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Linter](https://img.shields.io/badge/Linter-Oxlint-F38020?logo=oxc&logoColor=white)](https://oxc.rs/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ✨ Features

- **🌐 Live Steam API Integration**: Fetches real-time featured games, specials, top sellers, new releases, coming soon titles, and daily deals via Steam Store endpoints.
- **🎠 Interactive Hero Carousel**: Auto-advancing spotlight banner with smooth animations, custom pagination dots, and manual navigation.
- **🛡️ Multi-Tier Safe Browsing Filter**:
  - Automatically parses Steam Content Descriptors (IDs 1, 3, 4 + notes).
  - Filters out explicit tags, genres, and flagged keywords.
  - One-click **Safe Browsing** toggle in the navbar with `localStorage` persistence.
  - Steam-style **Content Warning Gate** protecting direct visits to restricted game pages.
- **🔍 Instant Game Search**: Fast, responsive search bar with instant dropdown suggestions and keyboard/click navigation.
- **🛒 Persistent Shopping Cart**:
  - Slide-out side drawer with smooth transitions.
  - Add/remove items with dynamic cart badge indicator.
  - Total price calculation and persistence across sessions via `localStorage`.
- **📄 Rich Game Detail Pages**:
  - High-res media carousel and screenshots viewer.
  - Metacritic review scores, release dates, publishers, and developers.
  - PC system requirements and platform compatibility badges (Windows, macOS, Linux).
- **🎨 Authentic Steam Dark UI**:
  - Faithful Steam color palette and typography.
  - Glassmorphic navigation header with backdrop blur.
  - Shimmer loading skeletons, card glow hover states, and custom dark scrollbars.
- **⚡ Resilient Fallback Engine**: Seamlessly falls back to curated offline game datasets if network or CORS rate limits occur.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first engine) |
| **Routing** | [React Router v8](https://reactrouter.com/) |
| **Icons** | [React Icons](https://react-icons.github.io/react-icons/) (FontAwesome, Simple Icons, etc.) |
| **Linter** | [Oxlint](https://oxc.rs/) |

---

## 📁 Project Structure

```text
Steam-Replica/
├── public/                 # Static assets, SVG icons & favicons
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── CartIcon.jsx        # Navbar cart trigger with badge
│   │   ├── CartPanel.jsx       # Slide-over cart drawer
│   │   ├── Footer.jsx          # Steam-themed footer with social links
│   │   ├── GameCard.jsx        # Responsive game card with price badges
│   │   ├── GameGrid.jsx        # Categorized grid (Specials, Top Sellers, etc.)
│   │   ├── HeroCarousel.jsx    # Featured carousel banner
│   │   ├── Navbar.jsx          # Glassmorphic header & safe search switch
│   │   ├── PlatformIcons.jsx   # Windows/Mac/Linux platform indicators
│   │   └── SearchBar.jsx       # Real-time search autocomplete
│   ├── context/            # React Context providers
│   │   ├── AdultFilterContext.jsx  # Safe browsing filter state
│   │   └── CartContext.jsx         # Cart state & localStorage sync
│   ├── data/               # Static fallback datasets
│   │   └── fallbackGames.js
│   ├── hooks/              # Custom React hooks
│   │   ├── useCart.js          # Cart operations hook
│   │   └── useSteamApi.js      # Cached Steam Store API fetcher
│   ├── pages/              # Page views
│   │   ├── GameDetailPage.jsx  # Individual game overview & media
│   │   └── StorePage.jsx       # Storefront homepage
│   ├── utils/              # Helper utilities & content classifiers
│   │   └── adultFilter.js      # Descriptors & keyword safety classifier
│   ├── App.jsx             # Top-level routing & layout wrapper
│   ├── index.css           # Tailwind v4 theme & custom animations
│   └── main.jsx            # React root mount
├── vite.config.js          # Vite config with Tailwind plugin & Steam API proxy
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ or later recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) / [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shahariarpo/Steam-Replica.git
   cd Steam-Replica
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 📜 Available Scripts

- `npm run dev` — Starts the Vite development server with hot module replacement (HMR) and reverse proxy for the Steam API.
- `npm run build` — Compiles and optimizes assets for production deployment.
- `npm run preview` — Locally previews the production build.
- `npm run lint` — Runs Oxlint for ultra-fast code quality and syntax checks.

---

## 🔌 API & Proxy Architecture

The Steam Store API (`store.steampowered.com`) does not enable cross-origin requests (CORS) for client browsers. During local development, requests are transparently routed through a Vite development proxy configured in `vite.config.js`:

```javascript
server: {
  proxy: {
    '/steam-api': {
      target: 'https://store.steampowered.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/steam-api/, ''),
      secure: true,
    },
  },
}
```

If the API is inaccessible or network connectivity fails, the app automatically switches to high-quality fallback data to ensure continuous uptime and an uninterrupted user experience.

---

## 📄 License

Distributed under the [MIT License](LICENSE). Built for educational and portfolio demonstration purposes. Steam and the Steam logo are trademarks and/or registered trademarks of Valve Corporation.
