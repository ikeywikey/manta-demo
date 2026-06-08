# Manta Demo

This is the run sheet for the Manta demo video. It walks through one realistic workflow — fixing a buggy file with an AI agent, syncing the work with a teammate, and migrating an old project from Beads — while showing **every** Manta command. Target length: **under 3 minutes**.

Each step below lists the command(s) to run and, in plain text, what to point out on screen.

## Goals

1. **Migrate from Beads** — import an existing Beads issue log into Manta.
2. **Sync between teammates** — share issues over git so two people stay in sync.
3. **Use Manta with an agent** — drive an issue-based workflow with Claude.
4. **Show how fast Manta is** — compare against Beads with the `time` command in the CLI when there are a lot of issues.

Goals 2–3 run together on a single buggy file. Goals 1 and 4 share the closing segment but are two separate things: first we **migrate** a large Beads project into Manta (Goal 1), which conveniently leaves us with a lot of issues; then, with both tools holding that same large set, we **time the everyday commands** (`create`, `view`) on each to show Manta is faster (Goal 4).

## The story we're telling

We start with a repo that has one buggy file and no Manta set up. Over the course of the demo we:

1. Install and initialize Manta.
2. Have Claude find the bugs, file them as issues, and fix them — with Manta tracking the work.
3. Sync that work to a teammate over git.
4. Import a large old project from Beads, then time the everyday commands on it to show Manta is faster than Beads at scale.

The two people in the demo:

- **Ike** is at the keyboard, working `calculator.js` together with Claude (scan → file issues → sort → fix).
- **Ori** is the teammate who pulls Ike's finished work to show that issues sync across a team.

## Setup (before recording)

- A git repo with a remote both Ike and Ori can push/pull from, with one buggy file (`calculator.js`) committed. Manta **not** initialized.
- The buggy file lives at [`admin/demo-assets/calculator.js`](demo-assets/calculator.js). Its problems are a **deliberate mix of kinds** so sorting them assigns genuinely different fields:

  | Function | Problem | Kind | Triage → type / priority |
  |---|---|---|---|
  | `divide()` | no divide-by-zero guard (crashes) | crash bug | `bug` / `p0` |
  | `add()` | string inputs concatenate instead of summing | logic bug | `bug` / `p1` |
  | `average()` | empty array → `NaN`, no input validation | edge-case bug | `bug` / `p2` |
  | `square()` | JSDoc says "cube" but code squares | wrong docs | `docs` / `p3` |
  | `isEqual()` | loose `==` equality (lint smell, no crash) | warning | `task` / `p4` |

  The variety is the point: it lets us show `--priority`, `--type`, and `--assignee` all carrying real, distinct values rather than everything looking the same.
- A **large** Beads project (a few hundred issues) for the closing segment: the export file `beads-big.jsonl` to migrate from, **plus** that same project loaded in a working Beads install. Both tools need to hold the same large set so the speed comparison is fair.
- Leave Manta **uninstalled** on the demo machine — we install it live to show how little setup it needs. (Have `bun` ready.)

> **Budget: ~3:00 total.** Times per act below are targets — keep narration tight and let the commands speak. `mt view` is run between steps on purpose to show the state changing; keep those runs quick.

---

## Run of show

### Act 1 — Install & init *(Ike)* · ~0:30

1. **Install Manta.** One command, and nothing else to install.
   ```bash
   bun install -g manta-it
   ```
2. **`mt init`** — set Manta up in this repo. It creates the `.manta/` folder, adds a `merge=union` rule to `.gitattributes`, and writes an `AGENT.md` guide. *Say:* that merge rule is what lets teammates' issues combine cleanly later (we'll see it in Act 3).
3. **`mt version`**, then **`mt help`** — run them back to back. `version` confirms we're on the latest release; `help` prints the full command list, so scroll through it to give viewers a map of everything Manta can do.
   ```bash
   mt version
   mt help
   ```
4. **`mt view`** — shows an empty list. Manta is live and tracking, just with no issues yet.

### Act 2 — Agent workflow on `calculator.js` *(Ike + Claude)* · ~1:15

5. **`mt create`** — ask Claude to read `calculator.js` and file one issue per problem it finds. Have it create them with **only a title** so priority and type fall back to their defaults (`p5`, `task`) — that gives us something to fix up in the next step. The file has five problems of different kinds (see the setup table), but Claude scans live, so its exact wording and the issues it surfaces may vary from the titles below — treat them as a guide, not a script.
   ```bash
   mt create "divide() has no divide-by-zero guard"
   mt create "add() concatenates string inputs instead of summing"
   mt create "average() returns NaN on an empty array"
   mt create "square() JSDoc says cube but code squares"
   mt create "isEqual() uses loose == equality"
   ```
6. **`mt view`** — our first look at the list. Every issue is sitting at the default `p5 / task`. *Say:* this is the "before sorting" picture.
7. **`mt update`** — Claude now sorts each issue. Because the problems are genuinely different, the fields end up different too: the crash becomes a high-priority bug, the wrong comment becomes a low-priority docs task, and so on. We also split assignees between Ike and Ori. *Point out:* you can set several fields in one command, and you can use the short ID (e.g. `h3kp`) instead of the full `manta-h3kp`. One `mt update` per issue Claude filed — all five:
   ```bash
   mt update <id> --type bug  --priority p0 --assignee Ike   # divide() crash
   mt update <id> --type bug  --priority p1 --assignee Ike   # add() logic bug
   mt update <id> --type bug  --priority p2 --assignee Ori   # average() edge case
   mt update <id> --type docs --priority p3 --assignee Ori   # square() docs
   mt update <id> --type task --priority p4 --assignee Ike   # isEqual() warning
   ```
8. **`mt view`** — the same list, now properly sorted out: a real spread of priorities, types, and assignees. The before/after contrast with step 6 is the whole point of this segment.
9. **`mt view <id>`** — open the `p0` crash issue on its own to show the full detail view (description, metadata, who created and updated it).
10. **`mt update` + `mt close`** — do the **first one slowly** so viewers see the workflow actually happen. Claude takes the `p0` crash from start to finish:
    ```bash
    mt update <id> --status in_progress    # mark it as being worked on
    # ...Claude edits calculator.js and fixes divide()...
    mt close <id>                          # mark it done
    ```
11. **`mt view`** — the open list shrinks by one because closed issues are hidden by default. Then run **`mt view --all`** once to show the closed issue is still on record, not gone. *Say:* that's one issue worked and closed for real.
12. **Now run through the rest in one go.** With the workflow established, have Claude fix and close the four remaining issues back to back without narrating each one. Then run **`mt view`** again to show the open list is now empty (or down to whatever's left) — the whole batch cleared in a single pass.

### Act 3 — Sync between teammates *(Ike → Ori)* · ~0:30

13. **Ike** commits his fixes and the issue log, then pushes:
    ```bash
    git add .manta/manta.jsonl calculator.js
    git commit -m "fix calculator bugs + manta issues"
    git push
    ```
14. **Ori** (on his own machine) pulls the changes, syncs, and looks:
    ```bash
    git pull
    mt sync        # update Ori's local copy from the shared issue log
    mt view        # Ori now sees all of Ike's issues
    ```
    *Say:* this works without merge conflicts because of the `merge=union` rule `mt init` added back in Act 1 — git combines both people's issues instead of forcing one to win.

### Act 4 — Migrate from Beads, then speed test *(Goals 1 & 4)* · ~0:40

Two things back to back: import an old Beads project (migration), then race the everyday commands against Beads on that same large set (speed).

15. **`mt migrate`** — import a large existing Beads project into Manta:
    ```bash
    mt migrate ./beads-big.jsonl
    ```
    *Point out:* the summary line (Migrated / Skipped / Failed) and that issue IDs carry over (`beads-h53` becomes `manta-h53`). *Say:* this just loaded hundreds of issues into Manta — which is exactly the kind of large project where speed starts to matter, so let's race it against Beads.
16. **Time the same everyday commands on each tool.** With both Manta and Beads holding the same few-hundred-issue project, wrap each command in `time` and read the numbers out loud. Create an issue, then list issues:
    ```bash
    time mt create "Benchmark issue"     # Manta — add an issue
    time bd create "Benchmark issue"     # Beads — add an issue

    time mt view                         # Manta — list issues
    time bd list                         # Beads — list issues
    ```
    *Say:* Manta keeps a ready-to-go local database, so creating and listing stay near-instant even with hundreds of issues, while Beads slows down — and the gap only grows as the project gets bigger. Put the Manta and Beads times on screen side by side.

    > **Ideas — other benchmarks we could show** *(not in the run-of-show; pick whichever read best on camera, drop the rest to stay under budget):*
    >
    > - **Bulk create / throughput** — time a loop that creates many issues at once (e.g. 100 in a row) instead of a single `create`. This is where a slow per-write tool really compounds.
    >   ```bash
    >   time (for i in $(seq 1 100); do mt create "Bulk issue $i"; done)
    >   time (for i in $(seq 1 100); do bd create "Bulk issue $i"; done)
    >   ```
    > - **Update** — time changing a field on an existing issue (`mt update <id> --priority p1` vs the Beads equivalent), and/or a bulk update across many issues.
    > - **Close** — time `mt close <id>` vs the Beads equivalent, and/or closing many in a loop.
    > - **Filtered / sorted view** — time a query that has to scan and filter, not just dump the list (`mt view --priority p0`, `--assignee Ike`, `--type bug`) vs the Beads filter. Filtering is often where the gap is widest.
    > - **Single-issue detail** — time `mt view <id>` vs the Beads show command (a point lookup, not a full list).
    > - **Migrate itself** — wrap the step-15 `mt migrate ./beads-big.jsonl` in `time` so the import speed is itself a number on screen.
    > - **Cold vs warm** — run a command twice and show the second is just as fast (no warm-up penalty), to make the "ready-to-go local database" point concrete.

### Act 5 — Wrap up & reset · ~0:15

The last two commands round out the command set and leave the repo clean for next time.

17. **`mt delete <id>`** — delete a single throwaway issue. Manta asks `[y/N]` first, so viewers see that deletes are guarded.
18. **`mt clear`** — the final step: wipe every issue to reset the repo. It also asks to confirm, then clears the whole log. *Say:* this is how you start fresh. **Destructive — erases all issue history.**

---

## Command checklist

Every command appears at least once:

| Command | Where |
|---|---|
| `bun install -g manta-it` | Act 1, step 1 |
| `mt init` | Act 1, step 2 |
| `mt version` | Act 1, step 3 |
| `mt help` | Act 1, step 3 |
| `mt view` (list / detail / `--all`) | Acts 1–4, steps 4, 6, 8, 9, 11, 12, 14, 16 |
| `mt create` | Act 2, step 5; Act 4, step 16 (benchmark) |
| `mt update` | Act 2, steps 7, 10 |
| `mt close` | Act 2, steps 10, 12 |
| `mt sync` | Act 3, step 14 |
| `mt migrate` | Act 4, step 15 |
| `mt delete` | Act 5, step 17 |
| `mt clear` | Act 5, step 18 |

## Goal checklist

- ✅ **Migrate from Beads** — Act 4, step 15 (`mt migrate`)
- ✅ **Sync between teammates** — Act 3
- ✅ **Use Manta with an agent** — Act 2
- ✅ **Speed vs Beads** — Act 4, step 16 (`time mt create` / `time mt view` vs the Beads equivalents, on a few-hundred-issue project)
