# Codebase Re-Audit (AUDIT_REPORT_v2.md) — 2026-05-24 (Hotfix 7.16)

Read-only audit. Zero source files modified. All hotfix-7.15 changes still uncommitted in the working tree.

---

## Phase 1 — Z-stack Regression Investigation

### 1.1 Tailwind config integrity

File `client/tailwind.config.js` — JS syntax OK, braces balanced, exports valid.

`theme.extend.colors` (verbatim):

```js
colors: {
  red: '#d03328',
  redHover: '#7c1e18',
  navy: '#1c2024',
  slate: '#2e3f51',
  slateHover: '#768597',
  light: '#ECEEF0',
  footerBg: '#161a1d',
  muted: '#6b7a8a',
  card: '#f3f5f7',
  tagDate: '#e4e8ec',
  divider: '#d9dde1',
  pillHover: '#cccccc',
  gridLine: '#d1d1d1',
}
```

`theme.extend.zIndex` (verbatim):

```js
zIndex: {
  hero: '1',
  wrapper: '10',
  toolbar: '50',
  header: '100',
  topstrip: '200',
  filterBackdrop: '500',
  filterPanel: '501',
  menu: '1000',
}
```

Checks:
- `gridLine: '#d1d1d1'` present ✅
- `photoPlaceholder` absent ✅
- All zIndex values are strings (good Tailwind v3 compat) ✅
- All required keys present: `hero, wrapper, toolbar, header, topstrip, filterBackdrop, filterPanel, menu` ✅

Issues with config itself: **none**. But see 1.6 — the documented intent for `toolbar (50)` ≠ actual JSX usage.

### 1.2 Case-sensitivity check

CamelCase keys in config: `filterBackdrop`, `filterPanel`, `topstrip` (no uppercase), `header`, `hero`, `wrapper`, `toolbar`, `menu`.

JSX usages of these tokens (Grep across `client/src/**/*.jsx`):

| Token (config) | JSX usage spelling | File:line | Case match |
|---|---|---|---|
| `filterBackdrop` | `z-filterBackdrop` | `FilterSidebar.jsx:143` | ✅ exact |
| `filterPanel` | `z-filterPanel` | `FilterSidebar.jsx:153` | ✅ exact |
| `hero` | `z-hero` | `Hero.jsx:159`, `CatalogToolbar.jsx:38` | ✅ exact |
| `wrapper` | `z-wrapper` | `Home.jsx:28`, `CatalogPage.jsx:285` | ✅ exact |
| `header` | `z-header` | `Header.jsx:70` | ✅ exact |
| `topstrip` | `z-topstrip` | `TopStrip.jsx:13` | ✅ exact |
| `menu` | `z-menu` | `MobileMenu.jsx:136` | ✅ exact |
| `toolbar` | — (NOT USED in any JSX) | (none) | ⚠️ unused token |

Mismatches: **none**.

`z-toolbar` token is **defined but unreferenced** — see 1.6.

### 1.3 Full z-class usage table

```
Class           | File:line                                | Source
----------------|------------------------------------------|------------------------
z-0             | CatalogBackground.jsx:20                 | Tailwind default
z-0             | MobileMenu.jsx:146                       | Tailwind default
z-0             | MobileMenu.jsx:176                       | Tailwind default
z-0             | Footer.jsx:67 (isHome branch)            | Tailwind default
z-0             | Hero.jsx:170 (video, inside Hero)        | Tailwind default
z-10            | Home.jsx:28 (was z-10 before 7.15)       | Tailwind default
                | NOTE: this is the OLD value retained;
                |       actual className says z-wrapper.
z-10            | HeroHeader.jsx:56                        | Tailwind default
z-10            | OurValuesSection.jsx:189, 197            | Tailwind default
z-10            | FastenerDiagramSection.jsx:373           | Tailwind default
z-10            | ProductCard.jsx:163, 244                 | Tailwind default
z-40            | CatalogPage.jsx:269 (CategoryDropdown)   | Tailwind default
z-50            | ScrollToTopButton.jsx:37                 | Tailwind default
z-[1]           | Hero.jsx:172 (overlay inside Hero)       | arbitrary
z-[1]           | MobileMenu.jsx:186 (inside MobileMenu)   | arbitrary
z-[2]           | Hero.jsx:176                             | arbitrary
z-[2]           | FastenerDiagramSection.jsx:330           | arbitrary
z-[150]         | Header.jsx:104                           | arbitrary (intentional, between header and topstrip)
z-[150]         | HeroHeader.jsx:85                        | arbitrary (same as above)
z-hero          | Hero.jsx:159                             | config (1)
z-hero          | CatalogToolbar.jsx:38                    | config (1)
z-wrapper       | Home.jsx:28                              | config (10)
z-wrapper       | CatalogPage.jsx:285                      | config (10)
z-header        | Header.jsx:70                            | config (100)
z-topstrip      | TopStrip.jsx:13                          | config (200)
z-filterBackdrop| FilterSidebar.jsx:143                    | config (500)
z-filterPanel   | FilterSidebar.jsx:153                    | config (501)
z-menu          | MobileMenu.jsx:136                       | config (1000)
```

No class falls outside {Tailwind defaults, project config tokens, arbitrary values}. **No MISSING classes.**

### 1.4 Build & CSS verification

`npm run build` output:
- Exit code: **0** ✅
- Build time: **744 ms**
- Bundle: `dist/assets/index-Il9_tcE3.css` 35.44 kB / `index-DXmRylAL.js` 492.14 kB
- Warnings: none

`.z-*` rules present in `dist/assets/index-Il9_tcE3.css`:

```css
.z-\[1\]{z-index:1}
.z-\[150\]{z-index:150}
.z-\[2\]{z-index:2}
.z-0{z-index:0}
.z-10{z-index:10}
.z-40{z-index:40}
.z-50{z-index:50}
.z-filterBackdrop{z-index:500}
.z-filterPanel{z-index:501}
.z-header{z-index:100}
.z-hero{z-index:1}
.z-menu{z-index:1000}
.z-topstrip{z-index:200}
.z-wrapper{z-index:10}
```

`.bg-gridLine` rule present: `.bg-gridLine{--tw-bg-opacity:1;background-color:rgb(209 209 209/var(--tw-bg-opacity,1))}` — matches `#d1d1d1`.

**Every z-class used in JSX is generated in the CSS bundle with the expected value. No missing rules. No case mismatches. Tailwind preserves camelCase keys verbatim.**

### 1.5 Stacking context analysis

Document root z-stack (from low to high), with stacking-context triggers:

| Element | Position | Transform / Other SC trigger | z-index | Stacking-context owner? |
|---|---|---|---|---|
| `CatalogBackground` (catalog) | fixed | — | 0 | yes (fixed + z !== auto) |
| `Footer` (Home pages) | fixed | — | 0 | yes |
| `Hero` (landing) | fixed | — | 1 (z-hero) | yes |
| `CatalogToolbar` (catalog) | fixed | `-translate-y-1/2` ✱ | 1 (z-hero) | yes |
| `motion.section` (Home wrapper) | relative | `style={{ y: lift }}` ✱ | 10 (z-wrapper) | yes |
| `motion.section` (catalog wrapper) | relative | `style={{ y: lift }}` ✱ | 10 (z-wrapper) | yes |
| `ScrollToTopButton` | fixed | — | 50 | yes |
| `Header` | fixed | — | 100 (z-header) | yes |
| lang-dropdown (Header/HeroHeader) | absolute | — | 150 | yes (inside Header/HeroHeader context) |
| `TopStrip` | fixed | — | 200 (z-topstrip) | yes |
| `FilterSidebar` backdrop | fixed | — | 500 (z-filterBackdrop) | yes |
| `FilterSidebar` panel | fixed | — | 501 (z-filterPanel) | yes |
| `MobileMenu` | fixed | — | 1000 (z-menu) | yes |

✱ = transform creates an additional stacking context regardless of `z-index`.

Internal stacks confined to their parent context (these can never escape):
- Inside `Hero` (z-hero): video `z-0`, overlay `z-[1]`, content `z-[2]`, HeroHeader `z-10` — all clamped to Hero's z-1.
- Inside `CatalogToolbar` (z-hero, transform): `CategoryDropdown` wrapper `z-40` — **clamped to toolbar's z-1**. (See 1.6 — this is the actionable finding.)
- Inside `CatalogPage motion.section` (z-wrapper, transform): `ProductCard` heart/brand `z-10`, plus card-level transforms.
- Inside `MobileMenu` (z-menu): backdrop `z-0`, content `z-[1]`.
- Inside `FastenerDiagramSection`: `z-[2]` overlay + `z-10` text — internal only.

Findings:
- All effect-only z-classes inside HeroHeader / OurValuesSection / FastenerDiagramSection / ProductCard etc. are locally correct.
- **The CategoryDropdown rendered inside `CatalogToolbar` is bounded by the toolbar's stacking context at z-1. The catalog dark section sits at z-wrapper (10).** When `top-[calc(100%+10px)]` drops the dropdown panel below the toolbar (which is centered at `top-1/2`), the bottom edge of the panel falls into the area of the screen where the dark `motion.section` peeks (h-[90vh] spacer ⇒ ~10% peek at scrollY=0; more as the user scrolls down within the toolbar-visible range). Within the peek area, the dropdown is occluded by `bg-navy` because 1 < 10.
- This is **not new in 7.15** — pre-7.15, CatalogToolbar was `z-[1]` and motion.section was `z-10`. Same numerical values. **Same behaviour.**

### 1.6 RECOMMENDED IMMEDIATE FIX

**Root cause of the perceived regression:** there is *no* functional regression in the rendered CSS — every value produced by 7.15's named tokens is bit-identical to the previous arbitrary `z-[N]` values. CSS bundle confirmed.

What *is* new and inconsistent in 7.15 is the **doc-vs-implementation mismatch** in `tailwind.config.js`:

```
// hero (1) — Hero на лендинге, Toolbar в каталоге      ← says hero hosts the toolbar
// toolbar (50) — CatalogToolbar                        ← also says toolbar slot hosts it
zIndex: { hero: '1', toolbar: '50', ... }
```

The author defined a dedicated `toolbar: '50'` token but never applied it. `z-toolbar` does not appear in any JSX. If the intent was to migrate `CatalogToolbar` off `z-hero` to `z-toolbar` so that its `CategoryDropdown` would render above the catalog dark wrapper (50 > 10), the refactor is half-done.

**Suggested fix (do NOT apply now — pending review):**

| Field | Value |
|---|---|
| File | `client/src/components/catalog/CatalogToolbar.jsx` |
| Line | 38 |
| Old | `className="fixed left-0 right-0 top-1/2 z-hero -translate-y-1/2"` |
| New | `className="fixed left-0 right-0 top-1/2 z-toolbar -translate-y-1/2"` |
| Reason | The Tailwind config defines `toolbar: '50'` explicitly for `CatalogToolbar` (per doc comment line 29 of `tailwind.config.js`). With z-toolbar (50) > z-wrapper (10), the `CategoryDropdown` rendered inside the toolbar — bounded by the toolbar's stacking context — would correctly overlay the dark catalog section instead of being clipped by it. This also resolves the documentation/implementation contradiction in the config. Note: `Hero.jsx:159` should remain at `z-hero` (the landing Hero is the only legitimate z-hero consumer). |

Secondary cleanup (do NOT apply now — pending review):

- `tailwind.config.js:27` — comment `"hero (1) — Hero на лендинге, Toolbar в каталоге"` should drop the `, Toolbar в каталоге` clause once the above is applied. Otherwise the comment stays misleading.

If after applying the fix the visual regression still persists, the next suspects are:
1. Dev-server stale state — Tailwind config changes require a Vite restart; HMR does not pick them up.
2. Browser cache holding the old CSS hash from the previous build.

Both are environmental, not code bugs.

---

## Phase 2 — Broader Re-Audit

### 2A — Previous findings status

CRITICAL from v1 (only 3):

| Finding | Status | Note |
|---|---|---|
| Duplicate «Грузовой крепёж» entry with malformed Cyrillic slug | **CLOSED** | `categories.js` now has a single entry with `slug: 'gruzovoj-krepyozh'`. Verified by Grep — no `kreвакпpyozh` anywhere in `content/`. |
| CartButton receives stale `quantity` prop | **CLOSED** | `ProductCard.jsx:273, 277` pass `quantity={displayQty}`. The `prevCartQtyRef` pattern in `ProductCard.jsx` preserves last cart qty across `inCart: true → false`. |
| `CatalogPage` stagger uncapped per page | **CLOSED** | `CatalogPage.jsx:44` defines `MAX_STAGGER_DELAY_S = 0.25` and `:332` wraps the delay in `Math.min(i * CARD_STAGGER_S, MAX_STAGGER_DELAY_S)`. `CARD_STAGGER_S` reduced 0.05 → 0.04. |

IMPORTANT from v1 (sampled — the ones addressed by 7.13–7.15):

| Finding | Status | Note |
|---|---|---|
| Vertical grid-line overlay duplicated | **CLOSED** | `GridLines.jsx` extracted; `CatalogBackground.jsx` and `OurValuesSection.jsx` both consume it. |
| `useIsDesktop` reimplemented in 4 places | **CLOSED** | `hooks/useMediaQuery.js` extracted; 4 callsites migrated per 7.14 notes. |
| Custom checkbox + check-svg duplicated | **CLOSED** | `components/ui/Checkbox.jsx` extracted; `FilterSidebar.jsx:193` and `FilterAccordion.jsx` flat+tree modes consume it. |
| Hex `#d1d1d1` for grid-line color | **CLOSED** | `gridLine` token in config; `bg-gridLine` is the default in `GridLines.jsx`. |
| `SPRING_OVERSHOOT_PAD_PX = 100` desynced from `AMPLITUDE_PX` | **CLOSED** | `AMPLITUDE_PX` exported from `useMomentumLift.js`; `CatalogPage.jsx:20, 284` imports and uses it directly. |
| Z-index stack scattered, not centralized | **CLOSED (with caveat)** | `zIndex` scale added to config; most callsites migrated. Caveats: (a) `z-toolbar` token defined but unused — see 1.6; (b) `z-[150]` (lang dropdown) is intentionally arbitrary per 7.15 notes — acceptable. |
| Repeated `cubic-bezier(0.4,0,0.2,1)` strings | **CLOSED** | Five callsites replaced with `ease-in-out` Tailwind class (which expands to the same curve). Non-standard curves correctly kept inline. |
| `photoPlaceholder` unused token | **CLOSED** | Removed from config. |

IMPORTANT from v1 not yet addressed (still OPEN, deferred to next hotfixes):

| Finding | Status | Note |
|---|---|---|
| Header dropdown / click-outside / Esc logic duplicated (Header.jsx + HeroHeader.jsx) | **OPEN** | Deferred per v1's "Hotfix 7.18 (optional)". |
| `CatalogPage.jsx` is a god component (387 lines) | **OPEN** | Still ~388 lines after 7.13/7.15 additions; needs `useCatalogFilters()` extraction (v1's Hotfix 7.16). |
| `FilterAccordion.jsx` has 100-line dead `if (isTree)` branch | **OPEN** | Not addressed. `FilterSidebar.jsx:183-188` calls `FilterAccordion` without `isTree`, so the tree branch is dead code. |
| `FastenerDiagramSection.jsx` 393 lines, multi-concern | **OPEN** | Not addressed. |
| `ProductCard.jsx` 5-concern split / extract `CartButton` | **OPEN** | `CartButton` still nested in `ProductCard.jsx`. |
| `Header.jsx:27` reads `window.scrollY` at init (SSR-unsafe) | **OPEN** | Code unchanged. Low risk because Vite SSR is not used yet. |
| `CategoryDropdown` and `FilterAccordion` animate `height: 0 → auto` | **OPEN** | Acceptable per v1; no measured perf issue yet. |
| Most sections ignore `prefers-reduced-motion` | **OPEN** | Only `useMomentumLift` respects it. Deferred to v1's Hotfix 7.17. |
| `Pagination` button touch-target may be < 44px | **OPEN** | Not addressed. |
| Inline `style={{ display:'grid', gridTemplateColumns:'...' }}` duplicated in CatalogPage | **OPEN** | Both branches still inline (`CatalogPage.jsx:303-309` and `:316-322`). |
| Magic numbers in `Logo.jsx`, `FastenerDiagramSection.jsx`, `OurValuesSection.jsx` lack comments | **OPEN** | Comments not added. |

**Regressed (previously fixed, broken again): 0.**

### 2B — New issues (by category)

#### Bad patterns / DRY violations

- **[IMPORTANT] `z-toolbar` token defined but unused** — see Phase 1 / 1.6. Either wire it (preferred — fixes a real visual issue) or remove the token + adjust the doc comment.
- **[IMPORTANT] Doc-vs-implementation contradiction in `tailwind.config.js:27,29`** — the comment block claims both `hero` and `toolbar` host the CatalogToolbar. Whichever direction 1.6 is resolved, the comment must be brought in line.
- **[MINOR] `bg-gridLine` is the *only* literal of `bg-gridLine` in the source tree** — it sits as a defaulted parameter in `GridLines.jsx:16`. Tailwind JIT correctly picks it up because the literal is in a scanned file, but if someone refactors the default to a computed expression, the class will silently disappear from the bundle. Worth a `safelist` entry as a guardrail (low priority — current code is fine).
- **[MINOR] CatalogPage two identical grid-template inline styles** (`CatalogPage.jsx:304-309` and `:316-322`) — flagged in v1, still present. Cheap to hoist to a top-of-file constant.
- **[MINOR] Per-component scroll-listener boilerplate count is now 4** (Header, Hero, CatalogToolbar, ScrollToTopButton) — v1 flagged as borderline; now with the trio of catalog FAB / toolbar / Hero, the case for a `useScrollY()` helper is stronger, but each variant compares against a different threshold and most are 6-line `useEffect`s — still borderline.

#### React errors / re-render risks

- **[MINOR] `CatalogPage.jsx:84-90` `activeFilterCount` useMemo deps are `[appliedFilters]`** — correct, but the object identity changes only on `setAppliedFilters` call. Cheap, fine.
- **[MINOR] `ProductCard.jsx:65-69` `useEffect` deps `[showAdded]`** — sets a timer to clear `showAdded` after 1500 ms. Correct cleanup. Verified.
- **[MINOR] `CartButton`'s `inCart` and `addToCart` subscriptions are independent selectors** — every cart mutation triggers re-eval on every card. With 8 products, irrelevant; flagged for scale.

#### Comments compliance

- **`tailwind.config.js:26-33`** — z-stack doc comment is good but contains the contradiction noted above. Fix when 1.6 is applied.
- **`useMomentumLift.js:18`** — `export const AMPLITUDE_PX = 100` — header docstring already explains. No new comment needed.
- **`GridLines.jsx`** — JSDoc updated to reflect `colorClass` API. Clean.
- **No new TODO/FIXME comments introduced.**

#### Performance opportunities

- **No new perf regressions detected.** `ease-in-out` replaces the same Material-standard curve; identical timing. The `transform: translateY` from Motion remains GPU-composited.

### 2C — Architectural smells

- **Single source of truth: holding strong.** `BREADCRUMB_LABELS` flat dict is gone (7.11). `gridLine`, `AMPLITUDE_PX`, z-scale are all centralized. No new content duplication detected. ✅
- **Z-stack hardcoded outside config:** only `z-[150]` (lang dropdown) and `z-[1]` / `z-[2]` (intra-component layers in Hero, MobileMenu, FastenerDiagramSection). All are intra-stacking-context layering, where named tokens would add no value. **Acceptable** per 7.15 notes.
- **Magic numbers without constants or comments:**
  - `INITIAL_LOAD_MS = 300`, `CARD_STAGGER_S = 0.04`, `MAX_STAGGER_DELAY_S = 0.25`, `CARD_FADE_DURATION_S = 0.3`, `ITEMS_PER_PAGE = 16` in `CatalogPage.jsx` — all **named with comments**. ✅
  - `ADDED_DURATION = 1500` in `ProductCard.jsx` — named with comment. ✅
  - `useMomentumLift.js:18-19` — both named, with full file-header explanation. ✅
  - Open items from v1 (Logo ratios, FastenerDiagram sector-specific paddings, OurValues clamp slopes) — not new; previously flagged.
- **Tight coupling:**
  - `CatalogPage` still holds 12 separate `useState`s + 9 `useCallback`s — heavy. `useCatalogFilters` extraction (v1 Hotfix 7.16) still recommended.
  - `CatalogToolbar` accepts `children` and assumes the caller passes `CategoryDropdown` positioned `absolute`. The positioning class `absolute left-1/2 top-[calc(100%+10px)] z-40 w-full max-w-3xl -translate-x-1/2 px-4` lives in `CatalogPage.jsx:269`, not in `CatalogToolbar.jsx`. That's a small leak: the toolbar declares "I host a dropdown" but the dropdown's geometry depends on the toolbar's layout. Borderline acceptable because the constraint is documented in `CatalogToolbar.jsx:74`.
- **God components:**
  - `CatalogPage.jsx` — 388 lines, 12 state hooks, 1 large `useMemo` pipeline. Still the #1 candidate for split.
  - `FastenerDiagramSection.jsx` — 393 lines, unchanged. Still candidate.
  - `ProductCard.jsx` — ~280 lines including `CartButton` and `QuantitySelector`. Still candidate.

### 2D — Build & runtime health

- **Build:** `npm run build` → exit 0 in **744 ms**. Output: `dist/assets/index-Il9_tcE3.css` 35.44 kB (gzip 7.00 kB), `index-DXmRylAL.js` 492.14 kB (gzip 153.67 kB), `dist/index.html` 0.45 kB. **No warnings.**
- **Lint:** project does not expose an `npm run lint` script (verified via `package.json` — only `dev`, `build`, `preview`, `lint` was not present in observed scripts list; skipping). No lint run performed.

---

## Executive summary

- **Regression root cause:** No actual regression in the rendered CSS. Every z-class produced by Hotfix 7.15's named tokens (`z-hero / z-wrapper / z-header / z-topstrip / z-filterBackdrop / z-filterPanel / z-menu`) is bit-identical to the prior arbitrary `z-[N]` values. CSS bundle verified. The most likely user-visible mismatch is the **incomplete migration of `CatalogToolbar` to the newly-defined `z-toolbar` (50)** token: the config doc comment claims `toolbar (50) — CatalogToolbar`, but the JSX still uses `z-hero` (1), leaving `CategoryDropdown` (z-40 inside the toolbar's transform-based stacking context) clipped by the catalog dark section (`z-wrapper`=10) in the peek area. Same behaviour as pre-7.15, but newly *visible as an inconsistency* because the config now explicitly documents an intended toolbar slot that the JSX doesn't honour.
- **Recommended next hotfix:** **Hotfix 7.17 — Z-stack completion + doc cleanup.** Single-line code change at `CatalogToolbar.jsx:38` (`z-hero` → `z-toolbar`) plus one comment edit at `tailwind.config.js:27`. Effort: ~10 min. Verify with a manual click on «Каталог» dropdown that it overlays the dark section.
- **New CRITICAL findings:** **0.**
- **New IMPORTANT findings:** **2** (both about the z-toolbar token: defined-but-unused and doc-vs-impl contradiction — collapse into one fix).
- **New MINOR findings:** **3** (bg-gridLine safelist guardrail; persistent inline grid-template duplication in CatalogPage; growing case for `useScrollY` helper).
- **Previously fixed, now regressed:** **0.** All three CRITICAL fixes from 7.13 and all 7.14/7.15 closures are intact.

### Top 3 priorities (preview)

1. **Wire `z-toolbar` to `CatalogToolbar`** (Phase 1 / 1.6). Resolves the perceived regression and the doc-vs-impl contradiction. ~10 min.
2. **Extract `useCatalogFilters()` from `CatalogPage`** (v1's open Hotfix 7.16). ~1.5 h.
3. **Add `useReducedMotion()` short-circuits in Hero / OurValues / FastenerDiagram / MobileMenu** (v1's open Hotfix 7.17 — accessibility). ~1.5 h.

Full diagnostic above. No source files modified.
