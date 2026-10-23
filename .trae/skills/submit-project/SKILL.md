---
name: submit-project
description: Git commit and push project to Gitee repository. Use when the user asks to commit, push, submit project, or deploy to gitee. Do not use for committing individual files or non-Git tasks.
---

# Submit Project — Git Commit & Push to Gitee

Commit all current changes in this project and push to the configured Gitee remote repository.

## Target Repository

- **Repo URL**: `https://gitee.com/neusoft_wangyao_jsj/yy-web-project`
- **Auth**: Gitee Personal Access Token (PAT) via `oauth2:` scheme in remote URL
- **Branch**: `main`
- **Working Directory**: resolve from workspace root (default: the current open project folder)

## Gitee Personal Access Token

The token is supplied at runtime. When executing this skill, retrieve or ask the user for the token and construct the remote URL as:

```
https://oauth2:<TOKEN>@gitee.com/neusoft_wangyao_jsj/yy-web-project
```

> **Security warning**: Never write the token into this SKILL.md or any committed file. This SKILL.md itself must be pushed without token embedded. After the push succeeds, if the token has been written into `origin` URL via `git remote set-url`, that is acceptable because `.git/config` is local and not tracked. But avoid committing `.git/config` changes anywhere else.

## Procedure

Execute these steps in order. All commands must run with `git -C "<project-root>"` using absolute paths — do not rely on `cd` or a persistent shell cwd.

### Step 1 — Pre-flight Checks

1. Run `git -C "<project-root>" status` to inspect:
   - Current branch (confirm it is `main`; if not, report and ask the user)
   - Whether there are changes to commit (modified / deleted / untracked)
   - Whether the branch has unpushed commits (`ahead of origin`)
2. Run `git -C "<project-root>" remote -v`. Check whether `origin` already points to the target Gitee URL above (with or without token embedded). If it points to a **different** repo (e.g. currently it points to `web-project`, not `yy-web-project`), record that and update it in Step 4.

### Step 2 — Stage All Changes

Run `git -C "<project-root>" add -A` to stage every change (modified, deleted, untracked). Then run `git -C "<project-root>" status --short` to confirm the staging result looks correct. If massive unrelated files appear (build outputs, zips, binaries not meant for commit), pause and ask the user before proceeding — suggest adding them to `.gitignore` first.

### Step 3 — Commit

PowerShell does **not** support bash heredoc (`cat <<'EOF'`) in git commit. Use multiple `-m` arguments instead:

```powershell
git -C "<project-root>" commit -m "feat: describe the change" -m "Optional longer description on a second line if needed"
```

The commit message should use conventional commit style (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`). Ask the user for a message if none is provided; otherwise construct a reasonable one from the actual changes observed in Step 1.

If there are **no staged changes** after Step 2 (nothing to commit), skip straight to Step 5 and report "no new changes to commit".

### Step 4 — Ensure Remote Points to Target Repo

After committing, check the remote URL again. If `origin` does **not** yet point to `https://gitee.com/neusoft_wangyao_jsj/yy-web-project`:

1. First, obtain the Gitee personal access token from the user at runtime (do **not** read it from this SKILL.md).
2. Run:
   ```powershell
   git -C "<project-root>" remote set-url origin "https://oauth2:<TOKEN>@gitee.com/neusoft_wangyao_jsj/yy-web-project"
   ```
3. Verify: `git -C "<project-root>" remote -v` should show the new URL with `oauth2:<TOKEN>` embedded.

### Step 5 — Push

Run:

```powershell
git -C "<project-root>" push -u origin main
```

If the push fails with an authentication error, re-check the token. If it fails with a non-fast-forward error, the remote has commits that are not in the local branch — report this to the user and suggest `git pull --rebase` before retrying.

### Step 6 — Verify & Report

After a successful push:

1. Run `git -C "<project-root>" status` and confirm: `Your branch is up to date with 'origin/main'` and `nothing to commit, working tree clean`.
2. Run `git -C "<project-root>" log --oneline -3` to show the latest commits.
3. Report to the user: commit hash, message, and push confirmation.
4. **Optional security cleanup**: if the token was embedded into the remote URL (which is fine for local `.git/config`), remind the user they can replace it with a fresh token in Gitee settings if desired.

## Environment Notes for Windows PowerShell

- Always use `git -C "<absolute-path>"` — never assume the shell starts in the project root.
- PowerShell does not support bash heredoc; use multiple `-m` flags for multi-line commit messages.
- `.ps1` scripts may be blocked by execution policy — invoke `git.exe` directly rather than wrapping in a `.ps1`.
- Do not use `&&` or `||` chaining between commands; PowerShell 5 does not support it. Run commands sequentially and check `$LASTEXITCODE` if needed.

## Failure Handling

| Failure | Action |
|---------|--------|
| PowerShell script execution policy blocks `.ps1` | Use `git.exe` directly, never wrapper scripts |
| `git commit` fails due to staged-vs-working confusion | Re-run `git status`, confirm staging with `git diff --cached` |
| `git push` auth failure | Re-ask for token; verify `remote -v` shows `oauth2:` URL |
| `non-fast-forward` on push | Pull-rebase first after user confirmation; never force-push unless explicitly approved |
| No `.git` directory | Run `git init`, add remote, then first commit+push |
