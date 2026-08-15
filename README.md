# Catspace

Welcome to Catspace! A social network where cats are the stars. 😺✨

Create a profile for your cat, share their latest adventures, follow other cats, and favorite the posts that deserve your attention. It's basically Myspace, but exclusively for cats (and the humans running their accounts).

### Core Features

- Create and customize cat profiles
- Share photos and updates
- Follow other cats
- Favorite posts
- Discover new cats and posts
- Personalized social feed
- English and French support

Built with **Angular**, using standalone components and signals. **Firebase/Firestore** handles data and authentication, **Cloudinary** is used for image hosting, and **Storybook** is used for component development and testing.

Visit the live site at [catspace.megankrenbrink.com](https://catspace.megankrenbrink.com).

Enjoy exploring Catspace!

— Megan Krenbrink

---

## Getting Started

### Prerequisites

- Node.js 20.19+, 22.12+, or 24.0+ (per [Angular 21's compatibility table](https://angular.dev/reference/versions))
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
ng build

# Run unit tests (Vitest)
ng test

# Run end-to-end tests (Playwright)
npm run e2e

# Start storybook server
npm run storybook
```

Open [http://localhost:4200](http://localhost:4200) to view the app.
Open [http://localhost:6006](http://localhost:6006) to view storybook.

### Environment Setup

The app needs a Firebase project to run against. Config lives in `src/environments/environment.ts` / `environment.prod.ts`, plus a gitignored `src/environments/firebase-key.ts` for your Firebase API key — never commit real credentials to this file.

## Tech Stack

- **Angular 21** (standalone components, signals) with **TypeScript**
- **Tailwind CSS** for styling
- **Angular Material** for UI components
- **Firebase Auth + Firestore** for authentication and data
- **Cloudinary** for image uploads
- **@ngx-translate** for i18n (English, French)
- **Storybook** for UI development
- **Vitest** for unit tests, **Playwright** for end-to-end tests
- **GitHub Actions** runs unit + e2e tests on every push/PR to `master` (see `.github/workflows/ci.yml`)

## Project Structure

```
src/
├── app/                # Main application code (components, pages, services, shared)
│   ├── components/     # Reusable feature components (auth, posts, profile card, etc.)
│   │   └── ui/         # UI primitives (buttons, banners, etc.)
│   ├── pages/          # Route-based feature pages (home, following, featured, profile)
│   ├── services/       # App services (auth, posts, follow, favorite, media, models, mocks)
│   ├── shared/         # Shared utilities, guards, state, types, directives, pipes
│   └── ...             # Other app logic
├── assets/             # Static assets (images, i18n translation files)
├── stories/             # Storybook stories for components
├── styles/              # Global and theme styles
└── environments/        # Environment configs (Firebase keys excluded from git)
```

## Data & Backend

Catspace runs on Firebase: Firestore holds users (`/users/{uid}`) and their posts (`/users/{uid}/posts`), and Firebase Auth handles login/signup. Image uploads go through Cloudinary. Mock data in `src/app/services/mocks/` is used only for unit tests and Storybook — the running app always talks to real Firestore.

## State Management

Hybrid signals + RxJS, no traditional NgRx store. Global state lives in **NgRx Signal Store** (`@ngrx/signals`) — `GlobalStore` at `src/app/shared/state/global.store.ts` currently tracks `isLoading`. Feature/domain state lives in services as signals (e.g. `AuthService.currentUserSignal`) alongside RxJS Observables for async streams. Signal Store is the pattern going forward for any new shared/global state.
