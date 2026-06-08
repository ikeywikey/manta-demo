// Generates a large Beads JSONL export for the Manta demo's migrate + speed
// benchmark (Act 4). Each line is one Beads issue with the field names the
// Manta migrator reads (id, title, status, priority, issue_type, owner,
// created_by, created_at, updated_at, _type) plus a few fields Manta drops,
// so the export looks like a real Beads log.
//
// Usage:
//   node generate-beads-big.js [count] > beads-big.jsonl
//   (defaults to 500 issues)
//
// Re-run with a different count to resize the benchmark dataset.

const COUNT = Number(process.argv[2]) || 500;

// Crockford base32 alphabet (what Manta/Beads suffixes use).
const BASE32 = '0123456789abcdefghjkmnpqrstvwxyz';

// Beads enums. priority is an integer (0 = highest).
const STATUSES = ['open', 'in_progress', 'blocked', 'closed'];
const TYPES = ['bug', 'feature', 'task', 'docs', 'chore'];
const OWNERS = ['ike', 'ori', 'angel', 'katie', 'ryan', 'david', 'nathan', null];

// Pieces for plausible-looking issue titles.
const VERBS = [
  'Fix', 'Refactor', 'Add', 'Remove', 'Investigate', 'Document', 'Optimize',
  'Handle', 'Validate', 'Cache', 'Log', 'Guard against', 'Rename', 'Update',
];
const NOUNS = [
  'login flow', 'session timeout', 'date parser', 'pagination', 'retry logic',
  'error message', 'config loader', 'rate limiter', 'CSV export', 'search index',
  'null check', 'migration script', 'webhook handler', 'cache key', 'auth token',
  'file upload', 'edge case', 'unit test', 'API client', 'form validation',
  'memory leak', 'race condition', 'timezone handling', 'feature flag',
];

function suffix(n) {
  // Deterministic 4-char base32 suffix from an index, so IDs are unique.
  let s = '';
  let x = n + 1;
  for (let i = 0; i < 4; i++) {
    s = BASE32[x % 32] + s;
    x = Math.floor(x / 32);
  }
  return s;
}

function pick(arr, n) {
  return arr[n % arr.length];
}

function isoAt(daysAgo, n) {
  // Spread issues across the last ~120 days; vary the time-of-day by index.
  const base = Date.now() - daysAgo * 24 * 60 * 60 * 1000;
  const offset = (n % (24 * 60)) * 60 * 1000;
  return new Date(base + offset).toISOString();
}

const lines = [];
for (let i = 0; i < COUNT; i++) {
  const createdAt = isoAt(120 - Math.floor((i / COUNT) * 120), i);
  const updatedAt = isoAt(60 - Math.floor((i / COUNT) * 60), i * 7);
  const title = `${pick(VERBS, i * 3)} ${pick(NOUNS, i * 5 + 1)}`;

  const issue = {
    _type: 'issue',
    id: `beads-${suffix(i)}`,
    title,
    status: pick(STATUSES, i * 2 + (i % 5)),
    priority: i % 5, // 0..4, 0 = highest
    issue_type: pick(TYPES, i + (i % 3)),
    owner: pick(OWNERS, i * 3 + 2),
    created_by: pick(OWNERS.filter(Boolean), i + 1),
    created_at: createdAt,
    updated_at: updatedAt,
    // Fields Manta drops, included for realism.
    started_at: i % 3 === 0 ? createdAt : null,
    dependency_count: i % 4,
    dependent_count: i % 3,
    comment_count: i % 6,
  };

  lines.push(JSON.stringify(issue));
}

process.stdout.write(lines.join('\n') + '\n');
process.stderr.write(`Generated ${COUNT} Beads issues.\n`);
