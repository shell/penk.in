// Email obfuscation with hidden decoys (CSS `display: none` technique,
// https://spencermortensen.com/articles/email-obfuscation/): the address is split into short
// pieces with junk pieces between them. CSS hides every 2nd child, so readers see and copy the
// real address, screen readers skip the decoys, and the full address never appears in the HTML.

export interface EmailPiece {
  tag: (typeof TAGS)[number];
  text: string;
}

// Varied inline tags (never span) so the decoys don't share an obvious marker.
const TAGS = ['i', 'b', 'em', 'small', 'u', 's'] as const;
const DECOYS = ['mx', '.no', 'spam', '-q', 'net', '7z', 'x@', 'bot'];

export function obfuscateEmail(email: string): EmailPiece[] {
  const chunks = email.match(/.{1,3}/g) ?? [];
  const pieces: EmailPiece[] = [];
  chunks.forEach((text, i) => {
    pieces.push({ tag: TAGS[i % TAGS.length], text });
    if (i < chunks.length - 1) pieces.push({ tag: TAGS[(i + 3) % TAGS.length], text: DECOYS[i % DECOYS.length] });
  });
  return pieces;
}
