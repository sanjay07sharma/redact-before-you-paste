/**
 * Collects the text ranges to mask. Guarantees no overlaps (first claim wins)
 * and applies the user's "keep visible" rules.
 */
import { hasCredentials, hostOf, normalize, splitTerms } from "./text-utils.js";

export class SpanSet {
  /**
   * @param {string} text           source text
   * @param {Iterable<string>} keep originals the user marked as not sensitive
   * @param {string} keepDomains    comma list of public hosts to leave visible
   */
  constructor(text, keep = [], keepDomains = "") {
    this.text = text;
    this.spans = [];
    this.protectedRanges = []; // kept items: visible, but no other rule may match inside them
    this.keep = new Set([...keep].map(normalize));
    this.keepHosts = new Set(splitTerms(keepDomains).map((d) => d.toLowerCase()));
  }

  overlaps(start, end) {
    const hit = (r) => start < r.end && end > r.start;
    return this.spans.some(hit) || this.protectedRanges.some(hit);
  }

  isKept(original, label) {
    if (this.keep.has(normalize(original))) return true;
    const isLink = label === "URL" || label === "DOMAIN";
    return isLink && this.keepHosts.has(hostOf(original)) && !hasCredentials(original);
  }

  /** Claim a range. Returns false if it overlaps or is on the keep list. */
  add(start, end, label, cat) {
    if (end <= start || this.overlaps(start, end)) return false;
    const original = this.text.slice(start, end);
    if (this.isKept(original, label)) {
      this.protectedRanges.push({ start, end });
      return false;
    }
    this.spans.push({ start, end, label, cat, original });
    return true;
  }

  sorted() {
    return [...this.spans].sort((a, b) => a.start - b.start);
  }
}
