# Git Conventions — Fastener Direct

Нормы работы с git для проекта Fastener Direct. Эти правила применяются ко всем участникам.

> Цель — единообразная история коммитов, по которой через год можно понять, что и зачем менялось, без расспросов и археологии.

---

## 1. Коммиты по стандарту Conventional Commits

Каждый коммит должен соответствовать формату:

```
<type>(<scope>): <короткое описание>

<тело — опционально>

<футер — опционально>
```

### 1.1 Типы коммитов (type)

Используй один из перечисленных. Никаких произвольных типов.

| Type       | Когда использовать                                                                  | Пример                                                     |
| ---------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `feat`     | Новая функциональность для пользователя или новый компонент/хук/секция              | `feat(client): add HeroSection with parallax`              |
| `fix`      | Исправление бага в существующей функциональности                                    | `fix(client): correct mobile menu z-index conflict`        |
| `refactor` | Переписали код без изменения поведения                                              | `refactor(client): extract Button size matrix to constant` |
| `style`    | Форматирование, отступы, кавычки. **НЕ про CSS-стили компонентов**                  | `style: apply prettier to all files`                       |
| `docs`     | Только документация (`*.md`, JSDoc, комментарии)                                    | `docs: update CODE_STYLE.md with motion API rules`         |
| `test`     | Добавление или изменение тестов                                                     | `test(client): add useCountUp unit tests`                  |
| `perf`     | Оптимизация производительности без изменения поведения                              | `perf(client): memoize SectionCard render`                 |
| `build`    | Изменения системы сборки, зависимости в package.json                                | `build: upgrade vite to 8.0.9`                             |
| `ci`       | Только CI/CD конфигурация                                                           | `ci: add lint check to pull-request workflow`              |
| `chore`    | Рутина, не подходящая под другие типы (обновление .gitignore, переименование папок) | `chore: rename _prototypes to legacy`                      |
| `revert`   | Откат предыдущего коммита                                                           | `revert: undo Header sticky behavior (broke iOS)`          |

**Что выбирать в спорных случаях:**

- Изменил Tailwind-класс у компонента → `feat` (если меняется визуал) или `fix` (если правится поломка)
- Обновил dependency → `build`, **не** `chore`
- Изменил CODE_STYLE.md → `docs`
- Добавил `// TODO: ...` → если только это, **не нужен отдельный коммит** — это сопровождение feat-коммита

### 1.2 Scope — область проекта

Указывай scope в скобках для уточнения, какую часть проекта затронул коммит.

**Список разрешённых scope:**

| Scope     | Что входит                                                                  |
| --------- | --------------------------------------------------------------------------- |
| `client`  | Всё в `client/src/`, `client/public/`, `client/*.config.*`                  |
| `server`  | Всё в `server/`                                                             |
| `db`      | Drizzle-схемы, миграции                                                     |
| `docs`    | Только `documentation/` и корневые `.md`-файлы                              |
| `deps`    | Изменение `package.json` без других изменений                               |
| без scope | Корневые конфиги (`docker-compose.yml`, `.gitignore`) или multi-area коммит |

**Примеры:**

```
feat(client): add NumbersSection with count-up animation
fix(server): handle missing customerId in order endpoint
docs: update README with development setup
build(deps): add zustand@5 and react-router-dom@7
```

### 1.3 Subject — короткое описание

Правила для строки заголовка после `<type>(<scope>):`:

1. **Максимум 72 символа** (включая type и scope). На GitHub более длинные строки обрезаются.
2. **Императив, настоящее время.** «add», «fix», «update» — не «added», «fixed», «adding».
3. **Без точки в конце.**
4. **С маленькой буквы** после двоеточия.
5. **На английском.** Тело и футер — на русском, если так удобнее, но subject — англ.

**Хорошо:**

```
feat(client): add MobileMenu with curtain animation
```

**Плохо:**

```
Feat(client): Added a Mobile Menu with the curtain animation.
```

(Capital, прошедшее время, лишний артикль, точка)

### 1.4 Body — тело коммита

Опционально, но **рекомендуется** для нетривиальных коммитов.

Правила:

- Пустая строка между subject и body.
- **Максимум 100 символов в строке** для читаемости в `git log`.
- Объясняй **что и зачем**, не **как** (как видно из diff).
- Можно списком, можно прозой.
- Можно на русском.

**Пример хорошего body:**

```
feat(client): add useScrollDirection hook

Used by Header to switch between dark and light themes when the user
scrolls past the Hero section. Returns both isPastThreshold (boolean)
and direction ('up' | 'down' | null) — second piece is reserved for
the auto-hiding header behavior on mobile.

Implementation uses a passive scroll listener without RAF throttling.
We'll add throttling only if profiling in Phase 4 shows jank.
```

### 1.5 Footer — метаданные

Опционально. Для:

- **BREAKING CHANGE** — если коммит ломает обратную совместимость:
  ```
  BREAKING CHANGE: Button no longer accepts `color` prop. Use `variant` instead.
  ```
- **Issue references:**
  ```
  Refs: #42
  Closes: #18, #19
  ```
- **Co-authored-by** (если pair-программирование):
  ```
  Co-authored-by: Имя <email@example.com>
  ```

---

## 2. Объединение нескольких изменений в один коммит

Бывает, что одна задача создаёт изменения в разных областях (например, новый хук + использование его в компоненте + обновление документации).

**Правило:** один коммит = одна логическая единица изменений.

### 2.1 Когда объединять

✅ Хук + его первое использование = **один коммит** (хук без потребителя бесполезен).
✅ Компонент + его barrel-export = **один коммит**.
✅ Несколько фаз миграции, если они формируют целостный foundation = **один коммит** с разделом по фазам в body.

### 2.2 Когда разделять

❌ Bugfix в Header + новый компонент Footer = **два коммита**.
❌ Обновление зависимости + рефакторинг под новое API = **два коммита** (`build` + `refactor`).
❌ Косметика (Prettier) + новая фича = **два коммита** (`style` + `feat`).

### 2.3 Пример объединения нескольких фаз

Если объединяешь несколько фаз в один коммит — структурируй body по разделам:

```
feat(client): add UI primitives, custom hooks, and animation foundation

Phase 1 — UI primitives (client/src/components/ui/):
- 8 SVG icons (BrandMark, User, YouTube, VK, Plus, Close, Burger, Arrow)
- Button: 3 sizes, CSS-only dual-arrow hover animation
- IconButton: 3 variants, pressed/interactive/visible states
- Logo: full/mark variants, dark/light themes
- Barrel exports in ui/index.js and ui/icons/index.js
- All components with JSDoc and PropTypes

Phase 2 — custom hooks (client/src/hooks/):
- useViewport: { canHover, isTouch } via matchMedia, SSR-safe
- useCountUp: RAF loop with ease-out cubic easing
- useScrollDirection: { isPastThreshold, direction }
- useInView intentionally omitted — used directly from motion/react

Notes:
- No new runtime dependencies
- Animations in Phase 1 are pure Tailwind CSS
- App.jsx playground will be replaced with real landing in Phase 6
```

---

## 3. Стратегия веток

### 3.1 Основные ветки

| Ветка  | Назначение                              | Защита                                                    |
| ------ | --------------------------------------- | --------------------------------------------------------- |
| `main` | Стабильное состояние, готовое к деплою  | Запрещён прямой push, только через PR                     |
| `dev`  | Активная разработка, интегрирующая фичи | Прямой push разрешён только для feature-веток через merge |

### 3.2 Feature-ветки

Любая работа делается в отдельной ветке, **отведённой от `dev`**.

**Naming convention:**

```
<type>/<short-description-kebab-case>
```

| Префикс     | Когда использовать                  | Пример                                          |
| ----------- | ----------------------------------- | ----------------------------------------------- |
| `feat/`     | Новая фича                          | `feat/hero-section`, `feat/mobile-menu-curtain` |
| `fix/`      | Багфикс                             | `fix/header-z-index`, `fix/menu-escape-key`     |
| `refactor/` | Рефакторинг без изменения поведения | `refactor/extract-section-wrapper`              |
| `chore/`    | Рутина                              | `chore/eslint-config-update`                    |
| `docs/`     | Документация                        | `docs/readme-setup`                             |

**Длина:** не более 5 слов в имени ветки. Если задача больше — разбей на под-задачи.

### 3.3 Workflow для одной фичи

```
1. git checkout dev
2. git pull origin dev                     # обновить базу
3. git checkout -b feat/hero-section       # создать ветку
4. ...работа, коммиты по правилам выше...
5. git push origin feat/hero-section       # пушим
6. Открыть PR в dev (НЕ в main)
7. После ревью и зелёного CI — merge в dev
8. После merge — удалить ветку (на GitHub и локально: git branch -d feat/hero-section)
```

### 3.4 Релизы

Когда `dev` стабилизируется и фаза проекта готова к деплою:

```
1. git checkout main
2. git merge --no-ff dev                   # сохраняем merge-commit
3. git tag -a v0.3.0 -m "Phase 3: Header, MobileMenu, Footer"
4. git push origin main --tags
```

Версии — по [Semantic Versioning](https://semver.org/lang/ru/):

- `0.x.y` — пока проект в разработке (до Phase 6 / production)
- Bump minor (`0.3.0 → 0.4.0`) — при завершении фазы
- Bump patch (`0.3.0 → 0.3.1`) — при горячем фиксе
- `1.0.0` — после деплоя production-версии

---

## 4. Правила для Pull Request

### 4.1 Заголовок PR

Совпадает с заголовком главного коммита. Например:

```
feat(client): add HeroSection with video background and parallax
```

### 4.2 Описание PR

Должно содержать:

1. **Что меняется** — короткий список изменений (1-3 пункта).
2. **Зачем** — какая задача решена.
3. **Скриншоты или GIF** — для визуальных изменений (любая фаза с UI).
4. **Чек-лист тестирования** — что проверить ревьюверу.
5. **Phase reference** — на какую фазу плана это работает.

**Шаблон:**

```markdown
## Что меняется

- Создан HeroSection с видео-фоном
- Подключён momentum-параллакс через motion/react
- Hero интегрирован с Header (тема переключается при уходе Hero)

## Зачем

Phase 4 плана миграции лендинга — реализация главной секции страницы.

## Скриншоты

[вставить gif или картинку]

## Как тестировать

- [ ] Открыть localhost:5173
- [ ] Проверить, что видео автоплеится без звука
- [ ] Прокрутить вниз — Header должен плавно переключиться на light theme
- [ ] Проверить на мобильном размере (DevTools)
- [ ] Проверить с `prefers-reduced-motion: reduce` — параллакс должен отключиться

## Phase reference

Phase 4 (Hero) из migration-plan.md
```

### 4.3 Размер PR

- **Идеал:** 1 фаза = 1 PR.
- **Максимум:** 500 строк изменений (без учёта auto-generated). Больше — разбивай на под-PR.
- **Не смешивай:** один PR = одна цель. Не комбинируй фичу с обновлением деп.

### 4.4 Ревью

Перед merge'ом нужно:

- [ ] CI зелёный (lint, build)
- [ ] Pre-flight + Definition of Done из соответствующего промпта Phase Х выполнены
- [ ] Визуальная проверка пройдена (скриншот в PR)
- [ ] Контрольный bash-скрипт пройден (если планировщик его выдавал)

Если работаешь один — сам себя ревьюишь, но дисциплинированно. Прохожусь глазами по diff'у целиком, не «approve на автомате».

---

## 5. Что НЕ коммитить

### 5.1 Файлы, которые должны быть в `.gitignore`

- `node_modules/`
- `client/dist/`, `server/dist/`
- `.env`, `.env.local` (только `.env.example` коммитим)
- `.DS_Store`, `Thumbs.db`
- `*.log`
- `.vscode/`, `.idea/` (если только не shared проектные настройки)
- `client/public/uploads/` (пользовательские файлы)

### 5.2 Что не должно попадать в код

- API-ключи, пароли, токены — только в `.env`
- TODO без контекста (просто `// TODO`) — нужно `// TODO: <конкретное действие>`
- `console.log` в production-коде (только в playground)
- Закомментированный код «на всякий случай» — удалять, git помнит

### 5.3 Что можно коммитить временно, но **до merge'а в dev**

- `// TEMP:` метки для временной отладки — в feature-ветке ок, перед PR удалить
- Тестовые JSON-фикстуры — в feature-ветке ок, перед PR заменить на финальные
- Прототипы (`_prototypes/`) — лежат в репо до конца Phase 6, потом удаляются одним коммитом `chore: remove migrated prototypes`

---

## 6. Работа с историей

### 6.1 Когда переписывать историю

✅ **До push'а** в feature-ветку — можно делать что угодно: `git rebase -i`, `git commit --amend`, `git reset`.

✅ **В своей feature-ветке после push'а** — можно, если уверен, что никто другой её не использует. Принудительный пуш: `git push --force-with-lease` (никогда не `--force` без `with-lease`).

❌ **В `main` и `dev`** — НИКОГДА. Никаких amend, rebase, force-push.

### 6.2 Squash перед merge

Перед merge'ом feature-ветки в `dev` — желательно **squash коммиты в один**, если:

- В ветке много мелких коммитов типа «WIP», «fix typo», «retry»
- Все коммиты решают одну задачу

**Не нужно** делать squash, если:

- Каждый коммит — самостоятельная логическая единица (например, в одном PR три отдельные фичи, что бывает редко)
- Каждый коммит хочется иметь в `git bisect` для дебага

GitHub при merge PR предлагает `Squash and merge` — это удобный способ.

### 6.3 Разрешение конфликтов

При rebase или merge:

1. Не паникуй.
2. Открой конфликтный файл, выбери правильную версию (или объедини обе).
3. **Перепроверь логику** — а не только синтаксис. Часто конфликт указывает на смысловое расхождение.
4. После разрешения: `git add <file>`, `git rebase --continue` (или `git commit` если merge).

Если запутался — `git rebase --abort` или `git merge --abort` возвращают всё назад.

---

## 7. Чеклист перед коммитом

Перед каждым `git commit` мысленно прохожу:

- [ ] Тип коммита (`feat`/`fix`/...) подходит к содержимому?
- [ ] Scope указан правильно?
- [ ] Subject в императиве, до 72 символов, без точки?
- [ ] Body объясняет «зачем», не «как»?
- [ ] Никаких секретов, ключей, паролей в коде?
- [ ] Нет `console.log`, `debugger`, закомментированного кода?
- [ ] Все TODO имеют конкретное действие после двоеточия?
- [ ] Файлы из `.gitignore` действительно игнорируются?
- [ ] `npm run dev` поднимается чисто?
- [ ] Лишние файлы (логи, кэши) не попали в коммит? (`git status` перед `git add`)

---

## 8. Полезные команды

### Просмотр истории

```bash
git log --oneline                        # компактная история
git log --oneline --graph --all          # с веточками
git log --grep="feat(client)"            # поиск по сообщению
git log -p path/to/file                  # история конкретного файла
git blame path/to/file                   # кто и когда менял каждую строку
```

### Откаты и фиксы

```bash
git commit --amend                       # дополнить ПОСЛЕДНИЙ коммит (до push'а)
git restore <file>                       # отменить незакоммиченные изменения файла
git reset --soft HEAD~1                  # отменить последний коммит, оставить изменения
git revert <commit-hash>                 # создать обратный коммит (для уже пушнутых)
```

### Ветки

```bash
git switch dev                           # переключиться (новый синтаксис)
git switch -c feat/new-feature           # создать и переключиться
git branch -d feat/done-feature          # удалить локальную ветку
git push origin --delete feat/done-feature  # удалить удалённую
```

### Stash (отложить изменения)

```bash
git stash                                # отложить
git stash list                           # посмотреть отложенное
git stash pop                            # вернуть последнее
```

---

## 9. Примеры из этого проекта

### Хороший коммит — Phase 1+2 объединённый

```
feat(client): add UI primitives, custom hooks, and animation foundation

Phase 1 — UI primitives (client/src/components/ui/):
- 8 SVG icons (BrandMark, User, YouTube, VK, Plus, Close, Burger, Arrow)
  with unified API (size, className, ariaLabel) and currentColor support
- Button: 3 sizes (sm/md/lg), CSS-only dual-arrow hover animation
- IconButton: 3 variants (light/dark/filled), pressed/interactive/visible states
- Logo: full/mark variants, dark/light themes, proportional scaling
- Barrel exports in ui/index.js and ui/icons/index.js
- All components with JSDoc and PropTypes

Phase 2 — custom hooks (client/src/hooks/):
- useViewport: { canHover, isTouch } via matchMedia, SSR-safe
- useCountUp: RAF loop with ease-out cubic easing, gated by start flag
- useScrollDirection: { isPastThreshold, direction } with passive listener
- useInView intentionally omitted — used directly from motion/react

Notes:
- No new runtime dependencies in either phase
- Animations in Phase 1 are pure Tailwind CSS; motion/react reserved for sections
- App.jsx contains a playground demonstrating all primitives and hooks live;
  it will be replaced with the real landing assembly in Phase 6
```

### Плохие коммиты — что не делать

```
update                                   ← непонятно что
Added Hero section.                      ← capital, прошедшее, точка
feat: stuff                              ← непонятно что
fix: bug                                 ← непонятно какой баг
WIP                                      ← в feature-ветке ок временно, в dev нельзя
feat(client): add a new and improved hero section that has video background and parallax effects
                                          ← слишком длинный subject
```

---

## 10. Когда правила можно нарушить

Этот документ — **набор привычек**, не догма. Случаи, когда правило сознательно нарушается:

- **Hot-fix в проде** — субъект может быть подлиннее ради ясности
- **Pair-programming** — может быть несколько scope'ов в одном коммите, если так логичнее
- **Эксперимент в спайк-ветке** — можно коммитить хаотично, перед merge всё равно squash

Главное правило: **если нарушаешь — объясни в body коммита почему**.
