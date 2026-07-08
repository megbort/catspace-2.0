Create a Storybook story file for an existing Angular component.

Arguments: $ARGUMENTS (component name, e.g. "post-card" or "ui/skeleton")

## Steps

1. Find the component file at `src/app/` — search for `<name>.component.ts`.

2. Read the component to understand:
   - Its `input()` signals (props)
   - Its template (what it renders)
   - Any dependencies it injects (services, translate, etc.)

3. Read an existing story for reference — `src/stories/post-card.stories.ts` is a good baseline.

4. Create `src/stories/<name>.stories.ts` following this structure (mirrors `post-card.stories.ts`):
   ```ts
   import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
   import { applicationConfig } from '@storybook/angular';
   import { TranslateModule } from '@ngx-translate/core';
   import { storybookTranslateConfig } from '../app/shared';
   import { provideHttpClient, withFetch } from '@angular/common/http';
   import { <Name>Component } from '../app/.../<name>.component';

   const meta: Meta<<Name>Component> = {
     title: '<Category>/<Name>',
     component: <Name>Component,
     decorators: [
       applicationConfig({
         providers: [
           provideHttpClient(withFetch()),
           // provide any injected services as stub values here
         ],
       }),
       moduleMetadata({
         imports: [TranslateModule.forRoot(storybookTranslateConfig)],
       }),
     ],
   };

   export default meta;
   type Story = StoryObj<<Name>Component>;

   export const Default: Story = { args: { ... } };
   export const Empty: Story = { args: { ... } };  // if applicable
   ```

   Use `applicationConfig` for root-level providers (services, HTTP) and `moduleMetadata` for imports (TranslateModule). Never use the deprecated `HttpClientModule` — always use `provideHttpClient(withFetch())`.

5. Include realistic mock data from `src/app/services/mocks/` if the component takes User or Post objects as inputs.

6. Provide at least 2 stories: a default/populated state and an edge case (empty, loading, or error state) where relevant.

7. Confirm the story file path and tell the user to run `npm run storybook` to preview it.
