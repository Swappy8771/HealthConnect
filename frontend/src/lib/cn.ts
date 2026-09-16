/**
 * Join class names, with later Tailwind utilities winning over earlier ones in
 * the same group.
 *
 * The primitives previously did `${base} ${className}`, which only appends —
 * so `<Card className="p-0">` left `p-6` in place and the result depended on
 * CSS source order rather than intent. This resolves the common conflicts
 * without pulling in clsx + tailwind-merge.
 */

// Utilities whose prefix identifies the group they conflict within.
const GROUP_PATTERNS: RegExp[] = [
  /^-?(p|px|py|pt|pr|pb|pl)-/,
  /^-?(m|mx|my|mt|mr|mb|ml)-/,
  /^(w|h|min-w|min-h|max-w|max-h)-/,
  /^(text|bg|border|ring|shadow|fill|stroke)-/,
  /^(rounded)(-|$)/,
  /^(flex|grid|block|inline|hidden|table|contents)$/,
  /^(items|justify|self|content|place)-/,
  /^(gap|space-x|space-y)-/,
  /^(font|leading|tracking)-/,
  /^(opacity|z|order|overflow)-/,
];

const groupOf = (cls: string): string => {
  // Keep responsive/state variants in their own bucket: `md:p-0` must not
  // displace `p-6`.
  const lastColon = cls.lastIndexOf(":");
  const variant = lastColon === -1 ? "" : cls.slice(0, lastColon + 1);
  const base = lastColon === -1 ? cls : cls.slice(lastColon + 1);

  for (const pattern of GROUP_PATTERNS) {
    const match = base.match(pattern);
    if (match) return variant + match[0];
  }
  return variant + base; // unrecognised: only an exact duplicate conflicts
};

export function cn(...inputs: Array<string | false | null | undefined>): string {
  const classes = inputs.filter(Boolean).join(" ").split(/\s+/).filter(Boolean);

  const winners = new Map<string, string>();
  for (const cls of classes) {
    winners.set(groupOf(cls), cls); // later wins
  }
  return Array.from(winners.values()).join(" ");
}
