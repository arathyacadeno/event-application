import { Event } from '../types';

/**
 * Checks whether an event's registration is currently closed.
 * Automatically handles:
 * 1. Explicit status ('closed')
 * 2. Auto-close when registration_closes_at date/time has passed (e.g. tomorrow end of day or specified date)
 * 3. Max capacity limit reached
 */
export const isEventRegistrationClosed = (
  event: Partial<Event> | null | undefined,
  currentRegistrationsCount?: number
): boolean => {
  if (!event) return false;

  // 1. Explicitly closed by organizer
  if (event.status === 'closed') {
    return true;
  }

  // 2. Auto-close if registration_closes_at date has passed
  const closesAt = event.settings?.registration_closes_at;
  if (closesAt && typeof closesAt === 'string' && closesAt.trim() !== '') {
    const trimmed = closesAt.trim();
    let closeTimestamp: number;

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      // Date only (e.g. "2026-09-16"): closes at end of that day (23:59:59.999 local time)
      const [year, month, day] = trimmed.split('-').map(Number);
      closeTimestamp = new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
    } else {
      const parsed = new Date(trimmed);
      if (!isNaN(parsed.getTime())) {
        if (trimmed.includes('T00:00:00') && !trimmed.includes(':01')) {
          const datePart = trimmed.split('T')[0];
          const [year, month, day] = datePart.split('-').map(Number);
          closeTimestamp = new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
        } else {
          closeTimestamp = parsed.getTime();
        }
      } else {
        closeTimestamp = NaN;
      }
    }

    if (!isNaN(closeTimestamp) && Date.now() > closeTimestamp) {
      return true;
    }
  }

  // 3. Check capacity limit if set
  const maxCap = event.settings?.max_registrations;
  if (
    typeof maxCap === 'number' &&
    maxCap > 0 &&
    typeof currentRegistrationsCount === 'number' &&
    currentRegistrationsCount >= maxCap
  ) {
    return true;
  }

  return false;
};

/**
 * Returns human-readable reason why registration is closed, or null if open.
 */
export const getEventClosedReason = (
  event: Partial<Event> | null | undefined,
  currentRegistrationsCount?: number
): string | null => {
  if (!event) return null;

  if (event.status === 'closed') {
    return 'Registration has been closed by the organizer.';
  }

  const closesAt = event.settings?.registration_closes_at;
  if (closesAt && typeof closesAt === 'string' && closesAt.trim() !== '') {
    const trimmed = closesAt.trim();
    let closeTimestamp: number;
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [year, month, day] = trimmed.split('-').map(Number);
      closeTimestamp = new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
    } else {
      const parsed = new Date(trimmed);
      closeTimestamp = !isNaN(parsed.getTime()) ? parsed.getTime() : NaN;
    }

    if (!isNaN(closeTimestamp) && Date.now() > closeTimestamp) {
      return `Registration closed on ${trimmed.split('T')[0]}.`;
    }
  }

  const maxCap = event.settings?.max_registrations;
  if (
    typeof maxCap === 'number' &&
    maxCap > 0 &&
    typeof currentRegistrationsCount === 'number' &&
    currentRegistrationsCount >= maxCap
  ) {
    return `Event reached maximum registration capacity (${maxCap} participants).`;
  }

  return null;
};
