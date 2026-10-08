"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Loader2,
  Monitor,
  Users,
  Video,
  X,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { calendarUrl, labPhase, type Checkpoint } from "@/lib/lab-session";
import { saveCommunityUpdate } from "../community-api";
import { getCommunityName } from "../community-profile";
import "./labs.css";

interface Lab {
  id: string;
  topic: string;
  desc: string;
  mentor: string;
  startsAt: number | null;
  endsAt: number | null;
  eventDate: string | null;
  timeZone: string;
  meetUrl: string | null;
  attendeeCount: number;
  attendees: string[];
  counts: Record<Checkpoint, number>;
  rsvped: boolean;
  checkpoint: Checkpoint | null;
  prep: string[];
  clue: string;
}

function download(filename: string, content: string) {
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/plain;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function FollowAlongLabs() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState<number | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState<Lab | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const dialog = useRef<HTMLDialogElement>(null);
  const refresh = useCallback(async () => {
    try {
      await auth.authStateReady();
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/forum/sessions", {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok)
        throw new Error("Labs could not be loaded. Please try again.");
      const result = await response.json();
      setLabs(result.sessions);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Labs are temporarily unavailable.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    setNow(Date.now());
    try {
      setNotes(JSON.parse(localStorage.getItem("leadwise_lab_notes") || "{}"));
    } catch {
      /* Notes are optional. */
    }
    const timer = window.setInterval(() => {
      setNow(Date.now());
      void refresh();
    }, 15_000);
    return () => window.clearInterval(timer);
  }, [refresh]);
  useEffect(() => {
    if (modal) dialog.current?.showModal();
  }, [modal]);

  async function respond(
    lab: Lab,
    action: "rsvp" | "checkpoint",
    checkpoint?: Checkpoint,
  ) {
    setBusy(lab.id);
    setMessage("");
    try {
      await saveCommunityUpdate(
        `/api/forum/sessions/${encodeURIComponent(lab.id)}`,
        action === "rsvp"
          ? { action, displayName: getCommunityName() || "" }
          : { action, checkpoint },
      );
      await refresh();
      if (action === "rsvp") {
        setModal(lab);
        setMessage("You're on the list. Your mission brief is ready.");
      } else
        setMessage(
          checkpoint === "green"
            ? "You're ready. Check-in saved for the room."
            : checkpoint === "yellow"
              ? "Your catch-up request is visible in the room. Take a breath."
              : "Your help signal is visible in the room. Share your error with the host in Meet.",
        );
    } catch {
      setMessage(
        "Your response could not be saved. Please reconnect and try again.",
      );
    } finally {
      setBusy(null);
    }
  }

  function saveNotes(id: string, value: string) {
    const next = { ...notes, [id]: value };
    setNotes(next);
    try {
      localStorage.setItem("leadwise_lab_notes", JSON.stringify(next));
    } catch {
      setMessage(
        "Notes will last for this visit; device storage is unavailable.",
      );
    }
  }

  return (
    <section className="follow-along-labs" aria-labelledby="lab-heading">
      <div className="lab-section-heading">
        <div>
          <span className="lab-eyebrow">The Follow-Along Theater</span>
          <h2 id="lab-heading">I'm right here with you.</h2>
          <p>
            Bring your lab and your questions. We'll work through the tricky
            parts together.
          </p>
        </div>
      </div>
      <p className="lab-feedback" role="status">
        {message}
      </p>
      {loading && (
        <p className="lab-loading">
          <Loader2 className="animate-spin" size={20} /> Loading scheduled
          labs...
        </p>
      )}
      {error && (
        <div role="alert" className="lab-notice">
          <p>{error}</p>
          <button onClick={() => void refresh()} className="lab-secondary">
            Try again
          </button>
        </div>
      )}
      {!loading && !error && labs.length === 0 && (
        <div className="lab-notice">
          <h3>The next lab is taking shape.</h3>
          <p>
            The date and mission will appear here when the host schedules it.
          </p>
        </div>
      )}
      {labs.map((lab) => {
        const phase =
          now === null ? "upcoming" : labPhase(lab.startsAt, lab.endsAt, now);
        const calendar = calendarUrl(lab);
        const delta =
          lab.startsAt !== null && now !== null ? lab.startsAt - now : null;
        const isSoon =
          lab.rsvped && delta !== null && delta > 0 && delta <= 10 * 60_000;
        const date =
          lab.startsAt !== null
            ? new Date(lab.startsAt).toLocaleString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                timeZone: lab.timeZone,
                timeZoneName: "short",
              })
            : lab.eventDate
              ? new Date(`${lab.eventDate}T12:00:00`).toLocaleDateString(
                  undefined,
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )
              : "Schedule coming soon";
        return (
          <article
            key={lab.id}
            className={`lab-event ${phase === "live" ? "lab-event-live" : ""}`}
          >
            {isSoon && (
              <div className="lab-alert">
                Your lab starts in {Math.ceil(delta! / 60_000)} minutes.
                {lab.meetUrl && (
                  <a
                    href={lab.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Hop into Google Meet
                  </a>
                )}
              </div>
            )}
            <div className="lab-event-heading">
              <div>
                <span
                  className={`lab-badge ${phase === "live" ? "lab-badge-live" : ""}`}
                >
                  {phase === "live"
                    ? "Room open"
                    : phase === "ended"
                      ? "Session ended"
                      : "Upcoming lab"}
                </span>
                <h3>{lab.topic}</h3>
                <p>
                  {lab.desc ||
                    "Follow along with the host, pause at checkpoints, and work through the lab together."}
                </p>
              </div>
              <div className="lab-date">
                <CalendarDays size={18} />
                <strong>{date}</strong>
                {lab.startsAt === null && (
                  <span>Central time - start time and Meet link TBD</span>
                )}
                {delta !== null && delta > 15 * 60_000 && (
                  <span>
                    Starts in{" "}
                    {delta > 86_400_000
                      ? `${Math.ceil(delta / 86_400_000)} days`
                      : delta > 3_600_000
                        ? `${Math.ceil(delta / 3_600_000)} hours`
                        : `${Math.ceil(delta / 60_000)} minutes`}
                  </span>
                )}
              </div>
            </div>
            <div className="lab-cohort">
              <span>
                <Users size={17} /> {lab.attendeeCount}{" "}
                {lab.attendeeCount === 1 ? "learner" : "learners"} attending
              </span>
              {lab.attendees.length > 0 && (
                <span>
                  {lab.attendees.join(", ")}
                  {lab.attendeeCount > lab.attendees.length
                    ? ` and ${lab.attendeeCount - lab.attendees.length} others`
                    : ""}
                </span>
              )}
              <span>Hosted by {lab.mentor}</span>
            </div>
            <div className="lab-actions">
              {phase !== "ended" &&
                (lab.startsAt !== null || lab.eventDate) && (
                  <button
                    className="lab-primary"
                    disabled={busy === lab.id || lab.rsvped}
                    onClick={() => void respond(lab, "rsvp")}
                  >
                    {busy === lab.id ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={17} />
                    )}
                    {lab.rsvped ? "You're on the list" : "RSVP - I'll be there"}
                  </button>
                )}
              {calendar && phase !== "ended" && (
                <a
                  href={calendar}
                  className="lab-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CalendarDays size={17} /> Add to Google Calendar
                </a>
              )}
              {phase === "live" && lab.meetUrl ? (
                <a
                  className="lab-live-join"
                  href={lab.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Video size={17} /> Join Live Google Meet
                </a>
              ) : (
                phase !== "ended" && (
                  <button disabled className="lab-secondary">
                    <Video size={17} />
                    {phase === "live"
                      ? "Waiting for host meeting link"
                      : "Meet opens 15 minutes before start"}
                  </button>
                )
              )}
            </div>
            {phase === "live" && (
              <div className="lab-workspace">
                <div>
                  <Monitor size={22} />
                  <h4>Speaker's screen in Google Meet</h4>
                  <p>
                    The host shares the terminal, VM, or cloud console. Bring
                    your own lab alongside it.
                  </p>
                </div>
                <div>
                  <BookLabel />
                  <h4>Your lab, your pace.</h4>
                  <p>Your questions belong in this room.</p>
                  <a
                    className="lab-secondary"
                    href="https://www.coursera.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Coursera
                  </a>
                </div>
              </div>
            )}
            <div className="lab-checkpoint">
              <h4>How's it going on your screen?</h4>
              <p>
                {phase === "live"
                  ? "Pause here with the host and check in."
                  : "Check-ins open with the lab."}
              </p>
              <div className="lab-lights">
                {(["green", "yellow", "red"] as const).map((color) => (
                  <button
                    key={color}
                    aria-pressed={lab.checkpoint === color}
                    disabled={phase !== "live" || busy === lab.id}
                    onClick={() => void respond(lab, "checkpoint", color)}
                  >
                    <i className={`lab-light-${color}`} />
                    <strong>
                      {color === "green"
                        ? "I'm ready"
                        : color === "yellow"
                          ? "Give me 60 seconds"
                          : "I need a quick look"}
                    </strong>
                    <span>
                      {color === "green"
                        ? "My command worked."
                        : color === "yellow"
                          ? "I'm catching up."
                          : "I hit an error."}
                    </span>
                    <small>{lab.counts[color]} checked in</small>
                  </button>
                ))}
              </div>
            </div>
            {lab.rsvped ? (
              <div className="lab-prep">
                <h4>Mission brief</h4>
                {lab.clue && <blockquote>{lab.clue}</blockquote>}
                {lab.prep.map((item, index) => (
                  <label key={`${lab.id}-${index}`}>
                    <input type="checkbox" />
                    {item}
                  </label>
                ))}
                <button
                  className="lab-secondary"
                  onClick={() =>
                    download(
                      "LeadWise-scenario-brief.txt",
                      `${lab.topic}\n\n${lab.desc}\n\n${lab.clue}\n\n${lab.prep.join("\n")}\n\nUse a practice environment, not a production system.`,
                    )
                  }
                >
                  <Download size={17} /> Download scenario brief
                </button>
                <label
                  className="lab-notes-label"
                  htmlFor={`lab-notes-${lab.id}`}
                >
                  My lab notes
                </label>
                <textarea
                  id={`lab-notes-${lab.id}`}
                  value={notes[lab.id] || ""}
                  onChange={(event) => saveNotes(lab.id, event.target.value)}
                  placeholder="What clicked? What do you want to ask?"
                />
                <small>Private notes, saved on this device.</small>
                <button
                  className="lab-secondary"
                  onClick={() =>
                    download(
                      "LeadWise-lab-notes.txt",
                      notes[lab.id] || "No notes saved yet.",
                    )
                  }
                >
                  <Download size={17} /> Download my notes
                </button>
              </div>
            ) : (
              <p className="lab-prep-locked">
                Your mission brief and starter checklist unlock with your RSVP.
              </p>
            )}
          </article>
        );
      })}
      <dialog
        ref={dialog}
        className="lab-dialog"
        onClose={() => setModal(null)}
      >
        <button
          className="lab-dialog-close"
          aria-label="Close RSVP confirmation"
          onClick={() => dialog.current?.close()}
        >
          <X size={22} />
        </button>
        <h3>A seat for you.</h3>
        <p>Your RSVP is saved. Your mission brief is ready below.</p>
        {modal && calendarUrl(modal) ? (
          <a
            className="lab-primary"
            href={calendarUrl(modal)!}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CalendarDays size={18} /> Add to Google Calendar
          </a>
        ) : (
          <p>
            <Clock3 size={17} /> The host will add the time and Meet link soon.
          </p>
        )}
        <button
          className="lab-secondary"
          onClick={() => dialog.current?.close()}
        >
          Back to my lab
        </button>
      </dialog>
    </section>
  );
}

function BookLabel() {
  return <span className="lab-eyebrow">Your practice space</span>;
}
