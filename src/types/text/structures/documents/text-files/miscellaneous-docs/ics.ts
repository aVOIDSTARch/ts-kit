/**
 * iCalendar (.ics) — structural model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A reconstructable model of an iCalendar object: nested components (VEVENT,
 * VTODO, VTIMEZONE, VALARM, ...) and content lines with parameters. Line folding
 * and exact value text preserved for fidelity. No functions.
 *
 * Spec: RFC 5545 (+ RFC 7986 extensions)
 */

import type { SchemaVersion } from "../../../../versioning.js";

export interface IcsCalendar {
  meta: IcsMeta;
  /** The root VCALENDAR (and rarely, multiple). */
  components: IcsComponent[];
}
export interface IcsMeta extends SchemaVersion {
  lineEnding?: "\r\n" | "\n"; // RFC mandates CRLF
}

export interface IcsComponent {
  type: "component";
  name: string; // "VCALENDAR", "VEVENT", "VTIMEZONE", "VALARM", ...
  properties: IcsProperty[];
  components: IcsComponent[]; // nested (e.g. VALARM within VEVENT)
}
export interface IcsProperty {
  type: "property";
  name: string; // "DTSTART", "SUMMARY", "RRULE", "X-CUSTOM", ...
  params: IcsParam[]; // ordered; e.g. TZID, VALUE, CN
  value: string; // exact value text (decode per VALUE type as needed)
  valueType?: string; // hint: TEXT, DATE-TIME, DATE, DURATION, ...
  raw?: string; // original unfolded line
}
export interface IcsParam {
  name: string;
  value: string;
  quoted?: boolean;
}
