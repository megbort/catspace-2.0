# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Codex, and others) when working with code in this repository.

## What This Is

Catspace is a social media platform for cats — think Myspace but for felines. Built with Angular 21, Firebase/Firestore backend, and deployed at catspace.megankrenbrink.com.

## Commands

```bash
npm start            # Dev server at http://localhost:4200
ng build             # Production build → dist/catspace-2.0
ng test              # Unit tests (Vitest + jsdom)
npm run e2e          # End-to-end tests (Playwright, ./e2e)
npm run storybook    # Component explorer at http://localhost:6006
```

CI (`.github/workflows/ci.yml`) runs `ng test` then `npm run e2e` on every push/PR to `master`, in that order, in one job. The e2e run boots a real dev server and hits live Firebase — CI reconstructs `src/environments/firebase-key.ts` from the `FIREBASE_API_KEY` secret first.

## Architecture

**Bootstrapping:** Standalone components only — no NgModules. Entry point is `main.ts` → `bootstrapApplication(AppComponent, appConfig)`. App config and providers live in `app.config.ts`.

**Routing:** Defined in `app.routes.ts` with lazy-loaded pages. Two guards in `src/app/shared/guards/`: `authGuard` (blocks unauthenticated users) and `redirectIfAuthenticatedGuard` (redirects logged-in users away from home). Root redirects to `/home`; `/home` redirects to `/following` if authenticated.

**State management:** Hybrid signals + RxJS. `GlobalStore` (NgRx Signals) at `src/app/shared/state/global.store.ts` holds global `isLoading`. Services expose signals (e.g., `AuthService.currentUserSignal`) and Observables. No traditional NgRx store.

**Data layer:** Firestore via `@angular/fire`. Users stored at `/users/{uid}`, posts at `/users/{uid}/posts`. Image uploads go to Cloudinary via `MediaService`. Auth is Firebase Auth.

**i18n:** `@ngx-translate` with JSON files in `src/assets/i18n/` (currently `en.json`, `fr.json`). Config lives in `src/app/shared/config/`.

**Styling:** Tailwind CSS (utility classes) + Angular Material (components/dialogs) + SCSS. Global styles in `src/styles.scss`; component styles use `.scss` files.

**SSR:** Not used — client-side rendering only, no `server.ts`.

## Key Patterns

- **Dialogs:** Feature components like `SignupComponent` and `CreatePostComponent` are opened as Angular Material dialogs, not navigated to as pages.
- **Reactive Forms:** Used throughout for auth and post creation (`FormBuilder`, `FormGroup`, `Validators`).
- **Barrel exports:** `src/app/services/index.ts` and `src/app/shared/index.ts` re-export services and utilities.
- **Models:** TypeScript interfaces for `User` and `Post` live in `src/app/services/models/`. `User` has fields: `id`, `email`, `image`, `handle`, `name`, `description`, `posts[]`, `following[]`, `favorites[]`, `followers[]`, `tags[]`. `Post` has: `id`, `title`, `image`, `description`, `favorites`, `comments[]`, `createdAt?`, `userId?`. Note: `User.posts` and `Post.comments` are unused placeholder fields — real posts are fetched from the `users/{uid}/posts` subcollection via `PostService`, not this array, and no comment feature exists yet. Don't rely on either field.
- **Mocks:** `src/app/services/mocks/` contains mock data used in tests and Storybook stories.

## Coding Standards

These conventions apply when writing or changing code. (Standalone components, signals, reactive forms, and `inject()` are already covered above.)

**TypeScript:** Strict type checking. Prefer type inference when the type is obvious. Avoid `any` — use `unknown` when a type is uncertain. Use semicolons and single quotes. Keep comments minimal — favor self-documenting code.

**Angular:** Do NOT set `standalone: true` in `@Component`/`@Directive`/`@Pipe` decorators (it's the default). Lazy-load feature routes. Use the `@unpic/angular` `unpic` directive for images (the established pattern in this codebase — not `NgOptimizedImage`), wrapped in `@defer (on viewport)` for below-the-fold images. Do NOT use `@HostBinding`/`@HostListener` — put host bindings in the `host` object of the decorator instead. Do NOT use `BehaviorSubject` for state — use signals.

**Components:** Use the `input()` and `output()` functions instead of decorators. Use `model()` instead of pairing `input()`/`output()` for two-way `[(prop)]` bindings. Use `computed()` for derived state, `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized. Set `changeDetection: ChangeDetectionStrategy.OnPush`. Use `class`/`style` bindings instead of `ngClass`/`ngStyle`. Query the DOM with the `viewChild()` signal, not the `@ViewChild` decorator. Prefer inline templates for small components.

**State:** Signals for local component state, `computed()` for derived state. Keep transformations pure. Never `mutate` a signal — use `set` or `update`.

**Templates:** Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`/`*ngFor`/`*ngSwitch`. Use the async pipe for observables. Don't assume globals like `new Date()` are available.

**Forms:** Prefer Signal Forms (`@angular/forms/signals`) for new forms — signal-based state, type-safe field access, schema-based validation. Use Reactive Forms where Signal Forms don't fit.

**Services:** Design around a single responsibility. Use `providedIn: 'root'` for singletons.

**RxJS:** `pipe()` to chain operators, `tap()` for side effects, `catchError()` for error handling, `filter()` to narrow types, `finalize()` for cleanup and ending loading states.

**Accessibility:** Must pass AXE checks and meet WCAG AA minimums — focus management, color contrast, ARIA attributes.

## Angular MCP

An `angular-cli` MCP server is configured for this project. **Always use it** when generating Angular artifacts — components, services, guards, pipes, directives, etc. — instead of writing files by hand or running `ng generate` via Bash. Use the MCP tools to scaffold code so schematics, file placement, and module wiring follow Angular CLI conventions automatically.

## Environment & Secrets

Firebase config is split across `src/environments/environment.ts`, `environment.prod.ts`, and `src/environments/firebase-key.ts` (gitignored key file). Never commit actual API keys — the key file is imported separately and excluded from version control.
