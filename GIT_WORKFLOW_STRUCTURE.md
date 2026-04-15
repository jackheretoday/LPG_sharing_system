# LPG Sharing System - Git Access and Collaboration Structure

## 1) Purpose
This document defines:
- who gets what GitHub access,
- who works in which project area,
- who should push and pull from each branch,
- and how to safely collaborate without breaking each other's work.

---

## 2) Repository Ownership and Access Levels
Use GitHub team-based permissions for this repository.

### A. Owners / Maintainers (Admin access)
Responsibilities:
- Manage repository settings, branch protection, secrets, and environment variables.
- Approve and merge Pull Requests (PRs) into main.
- Handle release tagging.

Should be limited to:
- Project lead
- Technical lead

### B. Core Developers (Write access)
Responsibilities:
- Create feature branches.
- Push code to their own branches.
- Open PRs to main.
- Review peer PRs.

Typical members:
- Backend developers
- Frontend developers
- Full-stack developers

### C. QA / Testers (Triage or Write access)
Responsibilities:
- Pull latest code.
- Run test cases.
- Open bug issues.
- Optionally push test scripts/docs to qa/* branches.

### D. Viewers / Stakeholders (Read access)
Responsibilities:
- View code, issues, and releases.
- No direct push permissions.

---

## 3) Branch Strategy

### Protected Branches
- main: production-ready code only.

Rules for main:
- No direct pushes.
- PR required.
- At least 1 reviewer approval.
- Resolve all conversations before merge.
- Keep main deployable.

### Working Branches
- feature/<area>-<task>
  - Examples:
    - feature/backend-auth
    - feature/frontend-login-ui
- bugfix/<area>-<issue>
- hotfix/<short-description>

Existing branch in this repository:
- feature-branch (general integration branch currently in use)

Recommended migration:
- Keep feature-branch for current work.
- Start using scoped feature/* branches for all new tasks.

---

## 4) Who Works on What (Resource Ownership)

### Backend Team
Primary directories:
- backend/config
- backend/controllers
- backend/middleware
- backend/models
- backend/routes
- backend/utilis

Backend should own:
- API contracts
- authentication and middleware
- database integration and migrations

### Frontend Team
Primary directories:
- frontend/src/components
- frontend/src/pages
- frontend/src/lib

Frontend should own:
- UI components
- route pages
- API consumption from backend endpoints

### Shared Ownership
Shared files (coordinate via PR comments):
- README.md
- .gitignore
- root-level documentation files

Avoid committing generated files:
- node_modules
- build artifacts
- local environment files

---

## 5) Push and Pull Rules (Who pushes what)

### Developers
Can do:
- Pull latest main before starting work.
- Create feature branch from latest main.
- Push only to their own branch.
- Open PR into main.

Should NOT do:
- Push directly to main.
- Force push to shared branches without team agreement.

### Maintainers
Can do:
- Merge PRs into main.
- Create release tags.
- Revert problematic merges when necessary.

### QA
Can do:
- Pull main and feature branches for testing.
- Push test docs or scripts only to qa/* or assigned branch.

---

## 6) Standard Daily Git Flow

### Step 1: Sync
- git checkout main
- git pull origin main

### Step 2: Create branch
- git checkout -b feature/<area>-<task>

### Step 3: Work and commit
- git add .
- git commit -m "feat: short description"

### Step 4: Push
- git push -u origin feature/<area>-<task>

### Step 5: Open PR
- Source: your feature branch
- Target: main
- Add reviewer(s)

### Step 6: After merge
- git checkout main
- git pull origin main
- git branch -d feature/<area>-<task>

---

## 7) Pull Request Checklist
Before raising PR:
- Code builds successfully.
- No secrets committed.
- No node_modules or generated artifacts committed.
- API changes documented.
- Screenshots attached for UI changes.
- Linked issue/task included in PR description.

---

## 8) Conflict Handling Policy
If merge conflicts happen:
- Pull latest main.
- Resolve conflicts locally.
- Re-run app and tests.
- Push updated feature branch.
- Never use destructive Git commands on shared history unless approved by maintainer.

---

## 9) Suggested Team Mapping Template
Use this table and fill actual GitHub usernames.

| Role | GitHub Username(s) | Access | Primary Responsibility |
|---|---|---|---|
| Maintainer | <add-here> | Admin | Repo settings, merge to main |
| Backend Dev | <add-here> | Write | backend/* |
| Frontend Dev | <add-here> | Write | frontend/src/* |
| QA | <add-here> | Triage/Write | Testing and validation |
| Stakeholder | <add-here> | Read | Tracking progress |

---

## 10) Final Notes
- Keep main clean and stable.
- Use focused branches for each task.
- Review before merge.
- Keep ownership clear by folder.
- Communicate API/UI contract changes early.
