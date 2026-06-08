# Demo assets

Supporting files for the [Manta demo](../manta-demo.md).

| File | Used in | Purpose |
|---|---|---|
| `calculator.js` | Act 2 | The buggy file Claude files issues against and fixes. Five different kinds of problem so triage assigns varied priorities/types/assignees. |
| `generate-beads-big.js` | Act 4 | Generator for the large Beads export below. |
| `beads-big.jsonl` | Act 4 | A large Beads export to `mt migrate` and benchmark against. Generated; not edited by hand. |

---

## Beads export generator

`generate-beads-big.js` writes a Beads-format JSONL export to stdout — a few
hundred synthetic issues used to demonstrate `mt migrate` and to benchmark
Manta's speed against Beads when there are a lot of issues (Act 4 of the demo).

### Generate the file

Run from this folder (`admin/demo-assets/`). It needs **Node** (plain
JavaScript, no Manta/Bun dependency):

```bash
# Default: 500 issues
node generate-beads-big.js > beads-big.jsonl

# Custom count, e.g. 1000, for a bigger speed gap
node generate-beads-big.js 1000 > beads-big.jsonl
```

The issue count is the first argument (defaults to 500). A progress line like
`Generated 500 Beads issues.` is printed to **stderr**, so it won't end up in
the redirected file.

### What it produces

Each line is one Beads issue with the fields Manta's migrator reads, plus a few
extra fields (`started_at`, `dependency_count`, etc.) that Manta drops, so the
export looks like a real Beads log:

```json
{"_type":"issue","id":"beads-0001","title":"Fix session timeout","status":"open","priority":0,"issue_type":"bug","owner":"angel","created_by":"ori","created_at":"...","updated_at":"...","started_at":"...","dependency_count":0,"dependent_count":0,"comment_count":0}
```

- **IDs** are unique (`beads-0001`, `beads-0002`, …) so nothing is skipped on import.
- **status** cycles through `open` / `in_progress` / `blocked` / `closed`.
- **priority** is an integer `0`–`4` (Beads style, `0` = highest), which Manta maps to `p0`–`p4`.
- **issue_type** spans `bug` / `feature` / `task` / `docs` / `chore`.
- **owner** / **created_by** are spread across the team (and some issues are unassigned).
- **timestamps** are spread across roughly the last 120 days.

Edit the `VERBS`, `NOUNS`, `OWNERS`, etc. arrays at the top of the script to
change the flavor of the generated titles and people.

### Verify it imports (optional)

The export has been tested through Manta's real migrate path. To re-check after
regenerating, run `mt migrate` against a throwaway repo and confirm `Failed: 0`:

```bash
mt init
mt migrate ./beads-big.jsonl
# Migration complete:
#   Migrated: 500
#   Skipped (already exist): 0
#   Failed: 0
```

> Note: `mt` runs on **Bun** (`bun:sqlite`), so a published `manta-it` install or
> `bun src/cli/index.js` is needed for this check — `generate-beads-big.js`
> itself only needs Node.
