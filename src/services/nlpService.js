import { addDays, set } from 'date-fns';

const PRIORITY_KEYWORDS = {
  urgent: 'high',
  high: 'high',
  medium: 'normal',
  low: 'low',
};

const CATEGORY_KEYWORDS = {
  work: 'work',
  office: 'work',
  personal: 'personal',
  home: 'personal',
  shopping: 'shopping',
  health: 'health',
};

export function parseTaskInput(text) {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  const dueDate = extractDueDate(lower);
  const priority = extractPriority(lower);
  const category = extractCategory(lower);
  const title = extractTitle(trimmed);

  return {
    title,
    dueDate: dueDate?.toISOString() ?? null,
    priority,
    category,
  };
}

function extractPriority(input) {
  for (const [word, value] of Object.entries(PRIORITY_KEYWORDS)) {
    if (input.includes(word)) return value;
  }
  return 'normal';
}

function extractCategory(input) {
  for (const [word, value] of Object.entries(CATEGORY_KEYWORDS)) {
    if (input.includes(word)) return value;
  }
  return 'general';
}

function extractTitle(input) {
  return input
    .replace(/\b(tomorrow|today|next week|at\s+\d{1,2}(?::\d{2})?\s?(am|pm)?)\b/gi, '')
    .replace(/\b(urgent|high|medium|low|work|personal|shopping|health)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim() || input;
}

function extractDueDate(input) {
  const now = new Date();

  if (input.includes('tomorrow')) {
    return set(addDays(now, 1), { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
  }

  if (input.includes('today')) {
    return set(now, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 });
  }

  const timeMatch = input.match(/at\s+(\d{1,2})(?::(\d{2}))?\s?(am|pm)?/i);
  if (timeMatch) {
    let hours = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2] || 0);
    const meridiem = timeMatch[3]?.toLowerCase();

    if (meridiem === 'pm' && hours < 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;

    return set(now, { hours, minutes, seconds: 0, milliseconds: 0 });
  }

  return null;
}
