# Steam Store Replica

A blazing-fast, modern, high-fidelity replica of the Valve Steam Store built with React 19, Vite, and Tailwind CSS v4. Features a rich static game catalog for instantaneous page loads, dynamic carousels, responsive game grids, shopping cart persistence, and intelligent adult content filtering with authentic Steam aesthetics.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-v8.3-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Linter](https://img.shields.io/badge/Linter-Oxlint-F38020?logo=oxc&logoColor=white)](https://oxc.rs/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Features

- **Interactive Hero Carousel**: Auto-advancing spotlight banner with smooth animations, custom pagination dots, and manual navigation.
- **Multi-Tier Safe Browsing Filter**:
  - Automatically parses content descriptors and adult tags.
  - Filters out explicit tags, genres, and flagged keywords.
  - One-click Safe Browsing toggle in the navbar with `localStorage` persistence.
  - Steam-style Content Warning Gate protecting direct visits to restricted game pages.
- **Instant Game Search**: Blazing-fast search bar with instant dropdown suggestions and keyboard/click navigation across the entire static catalog.
- **Persistent Shopping Cart**:
  - Slide-out side drawer with smooth transitions.
  - Add/remove items with dynamic cart badge indicator.
  - Total price calculation and persistence across sessions via `localStorage`.
- **Rich Game Detail Pages**:
  - High-res media carousel and screenshots viewer.
  - Metacritic review scores, release dates, publishers, and developers.
  - PC system requirements and platform compatibility badges (Windows, macOS, Linux).
- **Authentic Steam Dark UI**:
  - Faithful Steam color palette and typography.
  - Glassmorphic navigation header with backdrop blur.
  - Card glow hover states and custom dark scrollbars.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) |
| Build Tool | [Vite 8](https://vite.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first engine) |
| Routing | [React Router v8](https://reactrouter.com/) |
| Icons | [React Icons](https://react-icons.github.io/react-icons/) (FontAwesome, Simple Icons, etc.) |
| Linter | [Oxlint](https://oxc.rs/) |

---

## Project Structure

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
│   ├── context/             # React Context providers
│   │   └── CartContext.jsx         # Cart state & localStorage sync
│   ├── data/                # Static games dataset & lookups
│   │   └── gamesData.js
│   ├── hooks/                # Custom React hooks
│   │   └── useCart.js          # Cart operations hook
│   ├── pages/                # Page views
│   │   ├── GameDetailPage.jsx  # Individual game overview & media
│   │   └── StorePage.jsx       # Storefront homepage
│   ├── App.jsx              # Top-level routing & layout wrapper
│   ├── index.css            # Tailwind v4 theme & custom animations
│   └── main.jsx              # React root mount
├── vite.config.js          # Vite config
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ or later recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) / [yarn](https://yarnpkg.com/)

### Installation

```bash
git clone https://github.com/shahariarpo/Steam-Replica.git
cd Steam-Replica
npm install
```

### Running Locally

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.
