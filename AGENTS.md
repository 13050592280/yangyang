# AGENTS.md

## Overview

- `D:\yy-wbe-project` is a static HTML/CSS/JS course and practice showcase. There is no package manifest, build, lint, or automated test setup; verify by opening the page via `file://` and checking links, fonts, icons, and the browser console for 404s.
- `index.html` is the project directory page. Every new HTML page must be added there as a `.module-card` entry and the visible count updated.

## Layout and gotchas

- Root repo: branch `main`, remote `gitee.com/neusoft_wangyao_jsj/yy-web-project`. Its local `origin` URL embeds a Gitee OAuth token; never print `git remote -v`, copy `.git/config`, or commit the token.
- `web-project/` is a separate nested git repo tracked by the root only as a gitlink (there is no `.gitmodules`). Root git commands do not see changes inside it. Use `git -C "D:\yy-wbe-project\web-project"`; that repo uses branch `master` and remote `gitee.com/neusoft_wangyao_jsj/web-project`.
- The nested `web-project` skill mentions `D:\高级网页设计\web-project`; that path is stale. The checkout here is `D:\yy-wbe-project\web-project`.
- Keep assets local: vendored libraries live under `cdn/` and iconfont assets under `font/`. Do not switch pages to remote CDNs.
- Many filenames and directories are Chinese. Use absolute, quoted paths and PowerShell `-LiteralPath`.

## Conventions

- Prefix new custom CSS classes, ids, and JS variables with `yy_`. Leave third-party names (`.iconfont`, `.icon-*`, `fa-*`, `data-lucide`) unchanged. Existing shared classes in `index.html` (`.module-card`, `.module-number`, `.module-link`) are reused as-is.
- Before executing each user request, append a record (time, model, prompt) to `yy_prompt.md`; never overwrite previous entries.
- Keep page copy and docs in Chinese to match existing pages.
- Substantial feature work follows the documented flow: `spec.md` -> `plans.md` -> implement and verify -> `review-report*.md` -> manual check -> commit; update `retrospective.md` when closing a round.
- Use `skills/frontend-design/SKILL.md` for visual decisions and avoid the templated AI design defaults listed there.
- Use conventional commit prefixes (`feat:`, `fix:`, `docs:`, etc.).

## Git and submission

- Do not assume a clean tree: the root currently has uncommitted changes in `font/` and `四级项目/` plus untracked pages. Stage only intended files and ask before committing unrelated or binary files.
- To submit root changes, follow `.trae\skills\submit-project\SKILL.md` (Gitee `yy-web-project`, `main`). For the class submission inside `web-project/`, follow `.opencode\skill\web-project\SKILL.md` (Gitee `web-project`, `master`).
- PowerShell 5.1: no `&&` and no bash heredoc. Use `;`, `if ($?)`, and multiple `git commit -m` flags.
