---
name: submit-github
description: Git commit and push project to GitHub via SSH public key. Use when the user asks to commit, push, submit, or deploy this project to github.com. Do not use for Gitee submissions (use submit-project) or for committing individual files.
---

# Submit GitHub — Git Commit & Push to GitHub via SSH

Commit all current changes in this project and push to the configured GitHub remote repository using the already-configured SSH public key. No token or password is needed.

## Target Repository

- **Repo (web)**: `https://github.com/13050592280/yangyang`
- **Remote URL (SSH)**: `git@github.com:13050592280/yangyang.git`
- **Remote name**: `github` — do NOT overwrite `origin`; `origin` points to Gitee and its URL embeds a private token
- **Branch**: `main`
- **Working Directory**: resolve from workspace root (default: `D:\yy-wbe-project`)

## Security Rules

- Never print or copy the output of `git remote -v` or `git remote get-url origin` — the Gitee `origin` URL embeds an OAuth token. Only query the `github` remote by name: `git remote get-url github`.
- Never add tokens or credentials to any tracked file.
- The nested `web-project/` folder is a separate git repo (branch `master`) tracked by the root only as a gitlink. This skill operates on the root repo only; root git commands do not see changes inside `web-project/`.

## Procedure

Execute these steps in order. All commands must run with `git -C "<project-root>"` using absolute paths — do not rely on `cd` or a persistent shell cwd.

### Step 1 — Pre-flight Checks

1. Run `git -C "<project-root>" status` to inspect:
   - Current branch (confirm it is `main`; if not, report and ask the user)
   - Whether there are changes to commit (modified / deleted / untracked)
   - Whether the branch has unpushed commits
2. Verify SSH authentication to GitHub works (public key already installed):
   ```powershell
   ssh -T git@github.com
   ```
   GitHub answers with exit code 1 and a message like `Hi 13050592280! You've successfully authenticated, but GitHub does not provide shell access.` — that message means success. Any other error (Permission denied, Could not resolve hostname) means the SSH key is not set up; stop and ask the user.
3. Check whether the `github` remote already exists and points to the SSH URL:
   ```powershell
   git -C "<project-root>" remote get-url github
   ```
   If the remote is missing or points elsewhere, fix it in Step 4.

### Step 2 — Stage All Changes

Run `git -C "<project-root>" add -A` to stage every change (modified, deleted, untracked). Then run `git -C "<project-root>" status --short` to confirm the staging result looks correct. If massive unrelated files appear (build outputs, zips, binaries not meant for commit), pause and ask the user before proceeding — suggest adding them to `.gitignore` first.

### Step 3 — Commit

PowerShell does **not** support bash heredoc (`cat <<'EOF'`) in git commit. Use multiple `-m` arguments instead:

```powershell
git -C "<project-root>" commit -m "feat: describe the change" -m "Optional longer description on a second line if needed"
```

Use conventional commit style (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`). Ask the user for a message if none is provided; otherwise construct a reasonable one from the actual changes observed in Step 1.

If there are **no staged changes** after Step 2 (nothing to commit), skip straight to Step 5 and report "no new changes to commit".

### Step 4 — Ensure github Remote Points to Target Repo

After committing, configure the dedicated `github` remote (leave `origin` untouched):

```powershell
git -C "<project-root>" remote add github "git@github.com:13050592280/yangyang.git"
```

If it already exists with a wrong URL:

```powershell
git -C "<project-root>" remote set-url github "git@github.com:13050592280/yangyang.git"
```

Verify with `git -C "<project-root>" remote get-url github` (safe to print — SSH URL contains no secret).

### Step 5 — Push

```powershell
git -C "<project-root>" push -u github main
```

- If the push fails with `Permission denied (publickey)`, the SSH key is missing or not added to the GitHub account — re-run Step 1.2 and report to the user.
- If it fails with a non-fast-forward error, the GitHub repo has commits not present locally — report this and suggest `git -C "<project-root>" pull --rebase github main` before retrying. Never force-push unless the user explicitly approves.
- If the repository is empty on GitHub, the first push creates `main` — that is expected.

### Step 6 — Verify & Report

After a successful push:

1. Run `git -C "<project-root>" status` and confirm the working tree is clean.
2. Run `git -C "<project-root>" log --oneline -3` to show the latest commits.
3. Report to the user: commit hash, message, pushed branch (`main` -> `github/main`), and the repo URL `https://github.com/13050592280/yangyang`.

## Environment Notes for Windows PowerShell

- Always use `git -C "<absolute-path>"` — never assume the shell starts in the project root.
- PowerShell does not support bash heredoc; use multiple `-m` flags for multi-line commit messages.
- `.ps1` scripts may be blocked by execution policy — invoke `git.exe` / `ssh.exe` directly rather than wrapping in a `.ps1`.
- Do not use `&&` or `||` chaining; PowerShell 5 does not support it. Run commands sequentially and check `$LASTEXITCODE` if needed.

## Failure Handling

| Failure | Action |
|---------|--------|
| `ssh -T git@github.com` → Permission denied | SSH key not configured for this GitHub account; stop and ask the user |
| PowerShell script execution policy blocks `.ps1` | Use `git.exe` / `ssh.exe` directly, never wrapper scripts |
| `git commit` fails due to staged-vs-working confusion | Re-run `git status`, confirm staging with `git diff --cached` |
| `non-fast-forward` on push | Pull-rebase from `github` first after user confirmation; never force-push unless explicitly approved |
| No `.git` directory | Run `git init`, then follow Steps 2-5 |
| Remote repo URL is wrong | `git remote set-url github git@github.com:13050592280/yangyang.git`, then retry push |
