Generate a new routable page component and wire it into the app router.

Arguments: $ARGUMENTS (page name and optional route path, e.g. "notifications /notifications" or just "notifications")

## Steps

1. Use the `angular-cli` MCP to generate the component under `src/app/pages/<name>/`.
   - Standalone, SCSS, ChangeDetectionStrategy.OnPush

2. If no MCP tool is available, create the files manually:
   - `src/app/pages/<name>/<name>.component.ts`
   - `src/app/pages/<name>/<name>.component.html`
   - `src/app/pages/<name>/<name>.component.scss`

3. Open `src/app/app.routes.ts` and add a lazy-loaded route for the new page:
   ```ts
   {
     path: '<route>',
     loadComponent: () => import('./pages/<name>/<name>.component').then(m => m.<Name>Component),
     canActivate: [authGuard]   // add this if the page requires authentication
   }
   ```
   Ask the user if the route should be auth-protected if it's not obvious from the name.

4. Add translation keys for the page title and any nav label to both `src/assets/i18n/en.json` and `src/assets/i18n/fr.json`.

5. If the page should appear in the navigation menu, note that `src/app/components/menu/` and `src/app/components/user-sidenav/` are where nav links live — ask the user if they want to add it.

## Conventions
- Always `ChangeDetectionStrategy.OnPush`
- Use `input()`, `output()`, `viewChild()` signals — never decorator-based equivalents
- Inject with `inject()` function
- Pages are lazy-loaded — never eagerly imported in routes
