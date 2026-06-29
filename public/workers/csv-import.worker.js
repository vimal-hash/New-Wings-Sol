/* CSV bulk product import — runs in a Web Worker (background thread). */

// Parse one CSV line, respecting double-quoted fields with embedded commas.
function parseLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((v) => v.trim());
}

const EXPECTED_HEADERS = ['id', 'name', 'tagline', 'description', 'accent', 'icon'];

function parseCSV(csv) {
  const rows = [];
  const errors = [];

  // Normalise line endings, drop blank lines.
  const lines = csv
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    return { rows, errors: ['CSV is empty'], total: 0 };
  }

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase());
  const dataLines = lines.slice(1);
  const total = dataLines.length;

  dataLines.forEach((line, idx) => {
    const rowNum = idx + 2; // human-friendly (header is row 1)
    const cells = parseLine(line);
    const record = {};
    headers.forEach((h, i) => {
      record[h] = cells[i] ?? '';
    });

    const rowErrors = [];
    if (!record.id) rowErrors.push('missing id');
    if (!record.name) rowErrors.push('missing name');

    const valid = rowErrors.length === 0;
    rows.push({
      id: record.id || '',
      name: record.name || '',
      tagline: record.tagline || '',
      description: record.description || '',
      accent: record.accent || '',
      icon: record.icon || '',
      valid,
      error: valid ? null : rowErrors.join(', '),
    });

    if (!valid) {
      errors.push(`Row ${rowNum}: ${rowErrors.join(', ')}`);
    }

    // Emit progress every row (cheap; rows are small).
    self.postMessage({
      type: 'PROGRESS',
      payload: { processed: idx + 1, total },
    });
  });

  return { rows, errors, total, headers, expected: EXPECTED_HEADERS };
}

self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  if (type !== 'PARSE_CSV') return;

  try {
    const result = parseCSV(String(payload ?? ''));
    self.postMessage({ type: 'PARSE_COMPLETE', payload: result });
  } catch (err) {
    self.postMessage({
      type: 'PARSE_ERROR',
      payload: { message: err && err.message ? err.message : 'Failed to parse CSV' },
    });
  }
});
