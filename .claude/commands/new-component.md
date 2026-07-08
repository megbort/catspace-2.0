Generate a new standalone Angular component for this project.

Arguments: $ARGUMENTS (component name, e.g. "cat-badge" or "src/app/ui/cat-badge")

## Steps

1. Use the `angular-cli` MCP to generate the component. It should be:
   - Standalone (no NgModules)
   - SCSS styles
   - Placed under `src/app/` in a logical location based on the name (UI primitives → `src/app/components/ui/`, feature components → `src/app/components/`)

2. If no MCP tool is available, create the files manually following this pattern:
   - `component-name.component.ts` — standalone, ChangeDetectionStrategy.OnPush, inject TranslateService if any text is rendered
   - `component-name.component.html` — use Tailwind utility classes, no inline styles
   - `component-name.component.scss` — empty unless truly needed

3. If it's a UI primitive (goes under `src/app/components/ui/`), there is no barrel export to update — these are imported directly. Feature components under `src/app/components/` are also imported directly by their consumers.

4. If the component renders any user-visible text, add placeholder translation keys to **both** `src/assets/i18n/en.json` and `src/assets/i18n/fr.json` under a logical top-level key matching the component name.

5. Show the user the generated file paths and any translation keys added.

## Conventions
- Always `ChangeDetectionStrategy.OnPush`
- Use `input()` signal for inputs, `output()` for outputs — never `@Input()`/`@Output()` decorators
- Use `viewChild()` signal for DOM queries — never `@ViewChild`
- Inject with `inject()` function — never constructor injection
