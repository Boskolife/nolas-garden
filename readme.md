# Nola's Garden

Website for **Nola's Garden** — a premium floral studio in Los Angeles offering bespoke arrangements for celebrations, workspaces, weddings, and events. The site presents the brand story, portfolio, delivery area (LA & Orange County), and contact options.

## Tech Stack

- **Build:** [Vite](https://vitejs.dev/) 4.x
- **Templating:** [Handlebars](https://handlebarsjs.com/) via `vite-plugin-handlebars` (shared header, footer, modals, mobile menu)
- **Styles:** [Sass](https://sass-lang.com/) (variables, mixins, BEM-style layout)
- **Scripts:** JavaScript (ES modules), TypeScript for tooling
- **UI / Motion:** [Swiper](https://swiperjs.com/) (gallery), [Animate.css](https://animate.style/), [WOW.js](https://wowjs.uk/), [Typed.js](https://typedjs.com/)

## Project Structure

```
Nolas-Garden/
├── src/
│   ├── index.html          # Home page
│   ├── about.html          # About / story page
│   ├── portfolio.html      # Portfolio page
│   ├── templates/          # Handlebars partials
│   │   ├── header.html
│   │   ├── footer.html
│   │   ├── mobile-menu.html
│   │   ├── succes-modal.html
│   │   └── failure-modal.html
│   ├── styles/             # SCSS (base, layout, vendors)
│   └── js/
│       └── main.js         # Tabs, gallery, form, animations, ZIP check
├── public/                 # Static assets (images, etc.)
├── getHTMLFileNames.js     # Collects HTML entry points for Vite MPA
├── vite.config.js
└── package.json
```

## Requirements

- [Node.js](https://nodejs.org/) v16+

## Setup & Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build (output in dist/)
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Features

- **Multi-page:** Home, About, Portfolio with shared layout via Handlebars partials
- **Hero:** Tabbed content (Celebrations, Workspaces, Weddings, Baby showers) with images/video
- **Gallery:** Swiper slider with prev/next controls
- **Delivery:** ZIP code check and embedded map for LA / Orange County
- **Contact:** Form with success/failure modals
- **Accessibility:** Skip link, ARIA roles/labels, keyboard-friendly tabs
- **Animations:** Scroll-triggered (WOW.js) and character-level text effects

## License

MIT
