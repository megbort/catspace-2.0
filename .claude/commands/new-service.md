Generate a new Angular service following this project's patterns.

Arguments: $ARGUMENTS (service name, e.g. "comment" or "tag")

## Steps

1. Use the `angular-cli` MCP to generate the service under `src/app/services/`.

2. If no MCP tool is available, create `src/app/services/<name>.service.ts` manually:
   ```ts
   import { Injectable, inject, signal } from '@angular/core';

   @Injectable({ providedIn: 'root' })
   export class <Name>Service {
     // expose state as signals, not BehaviorSubjects where possible
   }
   ```

3. Add the export to `src/app/services/index.ts` so it's available via the barrel.

4. Consider the data layer:
   - If it touches Firestore: inject `Firestore` from `@angular/fire/firestore` and follow the pattern in `posts.service.ts` or `user.service.ts` — collections at `/users/{uid}/<collection>` or `/users/{uid}`
   - If it manages UI state only: expose signals and keep it simple

5. If the service handles user-visible notifications (success/error toasts), inject `NotificationService` and call it — don't use `alert()` or `console.log`.

6. Show the user the file path and the updated barrel export.

## Conventions
- `providedIn: 'root'` always
- Expose state as `signal()` or computed signals — not BehaviorSubjects — unless RxJS interop is truly needed
- Inject with `inject()` function — never constructor injection
- Error handling: catch Firestore errors and surface them via `NotificationService`
