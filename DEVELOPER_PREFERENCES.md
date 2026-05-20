# Developer Preferences & Standards

This document outlines the core technical and design preferences established during the development of the Savage Worlds Game Tracker. These standards should be applied to all future projects to ensure consistency and alignment with the developer's style.

## 🎨 Visual Identity: "High-Contrast Brutalism"
- **Color Palette**: Strictly high-contrast. White backgrounds, Black borders (`#000000`), and striking Red accents (`#CC0000`).
- **Typography**: 
  - **Headers**: Bold, uppercase Serif (e.g., Times New Roman) with tracking (letter-spacing).
  - **Body**: Clean, high-density Sans-Serif (e.g., Inter or system default).
- **Layout Patterns**:
  - **Data-Dense Dashboards**: Prefer single-page layouts with 3-column grids over multi-tab navigation.
  - **Section Containers**: Thick black borders (`2px solid black`), minimal padding, and uppercase headers with black backgrounds.
  - **Data Boxes**: Small, bold labels with a border-bottom, followed by large, high-weight values.
  - **Tables**: Dense tables with dotted borders (`border-dotted`) for rows and gray headers.

## 🛠 Technical Standards
- **Component Architecture**: 
  - Proactively use `'use client'` for all interactive components.
  - Keep components modular but maximize data density on the screen.
- **State Management & State Deserialization**:
  - Zustand is the preferred choice, utilizing the `persist` middleware for persistent local state.
  - **Hygiene**: Because Zustand stores persistent states locally, components must perform defensive checks and filtration (e.g. filtering out obsolete dynamic/duplicate records like raw `(Unskilled)`) to protect against legacy or stale browser local storage.
- **TypeScript Strictness**: Strictly avoid the usage of `any` types (e.g. `any[]`). Standardize on concrete, domain-specific types and interfaces (e.g., `SwadeWeapon[]`, `SwadeArmor[]`, `string[]`) to comply with strict linting rules.
- **Next.js, PWA, and ESLint**:
  - Use `@serwist/next` for PWA functionality.
  - **Critical Config**: Disable PWA features in development mode (`process.env.NODE_ENV === 'development'`) to avoid Turbopack conflicts. Use the `--webpack` flag in the `dev` script if necessary to support specific plugins.
  - **ESLint Ignores**: Dynamic build assets like PWA service workers (`public/sw.js` and `public/sw.js.map`) must be explicitly ignored in `eslint.config.mjs` using `globalIgnores` to avoid static analysis failures on minified compiler output.

## 🧪 Testing & Reliability
- **Logic Coverage**: Target **100% unit test coverage** for all engine, store, and utility logic using Vitest.
- **E2E Testing**:
  - Use Playwright for "Smoke Tests" (verifying app load, core interactions).
  - **Playwright Selectors in Strict Mode**: Avoid querying generic string labels that also exist within interactive components, descriptions, or tooltips. Use exact matches (e.g., `div:text-is("B")`) or unique suffix markers (e.g. `"Fighting:"`) to resolve selector ambiguity.
  - Store E2E tests in a dedicated `/e2e` directory (separate from `./src` or `./tests`).
  - Exclude `/e2e` from Vitest runs to avoid configuration overhead.

## 🚀 CI/CD & Workflow
- **GitHub Actions**: Every project must include a `.github/workflows/ci.yml` that automates:
  1. Linting
  2. Unit Testing (Vitest)
  3. Production Build (`npm run build`)
  4. E2E Testing (Playwright)
- **Task Tracking**: Maintain a granular `task.md` in the agent's brain/artifacts directory to track progress and state.
- **Git Hygiene**: Frequent commits. Use the GitHub CLI (`gh`) for repository management.
- **Git Push Restrictions**: Never execute `git push` or push commits to a remote repository without explicit user approval in the chat. All commits must remain strictly local until authorized.

## 🪙 Token & Context Optimization
- **Token Hygiene**: When explaining modifications, highlight only the exact line range changes using minimal git diffs or block snippets. Avoid restating or outputting large blocks of unchanged code.
- **Targeted Vitest**: During development and verification runs, execute unit tests target-specifically (e.g., `npm run test -- <filename> --run`) to minimize command outputs and prevent log-flooding in the terminal context.
- **Concise Outputs**: Keep all chat and artifact responses highly concise. Avoid conversational preambles, repetition, or over-explaining implementation details unless specifically requested.

