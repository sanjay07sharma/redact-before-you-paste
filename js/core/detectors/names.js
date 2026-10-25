/**
 * People and company names. Regex can't truly "know" a name, so these rules
 * only fire on strong cues: greetings, titles, sign-offs, legal suffixes.
 * Users add the rest through the custom term fields.
 */

/** Words that follow "Hi"/"Thanks" but aren't names. */
export const NON_NAMES = new Set([
  "Team", "All", "There", "Everyone", "Sir", "Madam", "Support", "Odoo", "Customer", "Client",
  "Guys", "Folks", "The", "This", "I", "We", "You", "Please", "Regards", "Thanks", "Best", "Hello", "Hi",
]);

const firstWordIsName = (v) => !NON_NAMES.has(v.split(/\s+/)[0]);

/** "Acme Textiles Pvt Ltd", "Zylo Technologies", "Foo GmbH" */
export const company = {
  id: "company", label: "CLIENT", cat: "names", trimSentenceDot: true,
  re: /\b(?:[A-Z][\w&'.-]*\s){0,4}[A-Z][\w&'.-]*\s(?:Pvt\.?\s?Ltd\.?|Private Limited|Ltd\.?|Limited|LLC|LLP|Inc\.?|GmbH|S\.?A\.?S?|SARL|SRL|B\.?V\.?|N\.?V\.?|Corp\.?|Corporation|Co\.|AG|PLC|Pte\.? Ltd\.?|Industries|Enterprises|Textiles|Technologies|Solutions)(?![\w])/g,
};

/** "Mr. Anil Kapoor", "DrRiley" */
export const titledName = {
  id: "title", label: "NAME", cat: "names", group: 1,
  re: /\b(?:Mr|Mrs|Ms|Miss|Dr|Prof|Shri|Smt|Mme|Mlle|M)\.?[ \t]+([A-Z][a-zA-Z'-]+(?:[ \t]+[A-Z][a-zA-Z'-]+){0,2})/g,
  check: firstWordIsName,
};

/** "Hi Simon," "Dear Sanjay Sharma" */
export const greetingName = {
  id: "greet", label: "NAME", cat: "names", group: 1,
  re: /\b(?:Hi|Hello|Hey|Dear|Bonjour|Namaste|Thanks|Thank you|Regards|Best|Cheers|Sincerely|Cordialement)[,!]?[ \t]+([A-Z][a-zA-Z'-]+(?:[ \t]+[A-Z][a-zA-Z'-]+)?)(?=[\s,!.:;]|$)/g,
  check: firstWordIsName,
};

/** Name on the line after "Best regards," */
export const signOffName = {
  id: "signoff", label: "NAME", cat: "names", group: 1,
  re: /(?:^|\n)\s*(?:Regards|Best regards|Kind regards|Thanks|Thank you|Cheers|Sincerely|Best)[,!]?[ \t]*\n[ \t]*([A-Z][a-zA-Z'-]+(?:[ \t]+[A-Z][a-zA-Z'-]+){0,2})/g,
  check: firstWordIsName,
};
