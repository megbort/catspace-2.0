Add a new translation key (or set of keys) to all i18n language files in this project.

Arguments: $ARGUMENTS (description of what needs translating, e.g. "a 'paw count' label and 'no paws yet' empty state for the post card")

## Steps

1. Read `src/assets/i18n/en.json` to understand the existing key structure and find the right top-level group (e.g. `post`, `profile`, `common`, `button`).

2. Add the new keys to `src/assets/i18n/en.json` with real English values.

3. Add the same keys to `src/assets/i18n/fr.json` with accurate French translations.
   - Use natural French — not word-for-word literal translation
   - Match the tone of existing French strings (informal/friendly, no "vous")

4. Show a diff of what was added to both files.

5. Remind the user to reference the keys in templates using the `translate` pipe:
   ```html
   {{ 'keyGroup.keyName' | translate }}
   ```
   Or in component TS via `TranslateService.instant('keyGroup.keyName')`.

## Key structure reference
Existing top-level groups: `common`, `button`, `form`, `menu`, `home`, `footer`, `profile`, `post`, `auth`, `media`, `createPost`, `editProfile`, `following`, `favorite`

Add new keys to the most relevant existing group. Only create a new top-level group if none of the above fit.
