export type Checkpoint = "green" | "yellow" | "red";
export type LabPhase = "unscheduled" | "upcoming" | "live" | "ended";

export function sessionMillis(value: unknown): number | null {
  if (
    value &&
    typeof value === "object" &&
    "toMillis" in value &&
    typeof value.toMillis === "function"
  ) {
    const millis = value.toMillis();
    return Number.isFinite(millis) ? millis : null;
  }
  const millis =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Date.parse(value)
        : NaN;
  return Number.isFinite(millis) ? millis : null;
}

export function labPhase(
  start: number | null,
  end: number | null,
  now: number,
): LabPhase {
  if (start === null) return "unscheduled";
  const finish = end !== null && end > start ? end : start + 90 * 60_000;
  return now >= finish
    ? "ended"
    : now >= start - 15 * 60_000
      ? "live"
      : "upcoming";
}

export function validMeetUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === "meet.google.com" &&
      /^\/[a-z]{3}-[a-z]{4}-[a-z]{3}\/?$/.test(url.pathname)
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function calendarUrl(session: {
  topic: string;
  desc: string;
  startsAt: number | null;
  endsAt: number | null;
  meetUrl: string | null;
}): string | null {
  if (session.startsAt === null || !session.meetUrl) return null;
  const stamp = (millis: number) =>
    new Date(millis)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  const end =
    session.endsAt !== null && session.endsAt > session.startsAt
      ? session.endsAt
      : session.startsAt + 90 * 60_000;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `LeadWise Lab: ${session.topic}`,
    dates: `${stamp(session.startsAt)}/${stamp(end)}`,
    details: `${session.desc}\n\nJoin Google Meet: ${session.meetUrl}`,
    location: session.meetUrl,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
