/**
 * Simple TF-IDF cosine-similarity based Vector Search simulation.
 * Calculates similarity of a search query against a document's content fields.
 */

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
  "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
  "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
  "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
  "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
  "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
  "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i",
  "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's",
  "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
  "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought",
  "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
  "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
  "than", "that", "that's", "the", "their", "theirs", "them", "themselves",
  "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
  "they've", "this", "those", "through", "to", "too", "under", "until", "up",
  "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
  "weren't", "what", "what's", "when", "when's", "where", "where's", "which",
  "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
  "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
  "yourself", "yourselves"
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

export type VectorSearchDocument = {
  id: string;
  title: string;
  titleFr?: string;
  summary: string;
  summaryFr?: string;
  problem?: string | null;
  problemFr?: string | null;
  solution?: string | null;
  solutionFr?: string | null;
  tags: string[];
  stack?: string[];
  meta?: string;
};

/**
 * Calculates vector similarity score (0 to 100) between query and document.
 */
export function calculateVectorMatchScore(query: string, doc: VectorSearchDocument): number {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return 0;

  // Build document corpus text with weighted importance
  // Title (weight 4x), tags/stack (weight 3x), problem/solution (weight 2x), summary/meta (weight 1x)
  const titleText = `${doc.title} ${doc.titleFr || ""}`.repeat(4);
  const tagsText = `${doc.tags.join(" ")} ${doc.stack ? doc.stack.join(" ") : ""}`.repeat(3);
  const coreText = `${doc.problem || ""} ${doc.problemFr || ""} ${doc.solution || ""} ${doc.solutionFr || ""}`.repeat(2);
  const descText = `${doc.summary} ${doc.summaryFr || ""} ${doc.meta || ""}`;

  const docText = `${titleText} ${tagsText} ${coreText} ${descText}`;
  const docTokens = tokenize(docText);

  if (docTokens.length === 0) return 0;

  // Count term frequencies for query
  const queryFreqs: Record<string, number> = {};
  queryTokens.forEach(token => {
    queryFreqs[token] = (queryFreqs[token] || 0) + 1;
  });

  // Count term frequencies for document
  const docFreqs: Record<string, number> = {};
  docTokens.forEach(token => {
    docFreqs[token] = (docFreqs[token] || 0) + 1;
  });

  // Cosine similarity calculation
  let dotProduct = 0;
  let queryMagnitudeSq = 0;
  let docMagnitudeSq = 0;

  // We construct the vector space using the union of query terms
  Object.keys(queryFreqs).forEach(term => {
    const qVal = queryFreqs[term];
    const dVal = docFreqs[term] || 0;
    dotProduct += qVal * dVal;
    queryMagnitudeSq += qVal * qVal;
  });

  // For document magnitude, we sum all terms in doc
  Object.keys(docFreqs).forEach(term => {
    const dVal = docFreqs[term];
    docMagnitudeSq += dVal * dVal;
  });

  if (queryMagnitudeSq === 0 || docMagnitudeSq === 0) return 0;

  const similarity = dotProduct / (Math.sqrt(queryMagnitudeSq) * Math.sqrt(docMagnitudeSq));
  
  // Normalize and scale similarity so that a single term match yields a visible score.
  const score = Math.min(100, Math.round(similarity * 350));
  
  // If the query exactly matches a full word in title, guarantee a boost
  const titleTokens = tokenize(`${doc.title} ${doc.titleFr || ""}`);
  const hasTitleMatch = queryTokens.some(q => titleTokens.includes(q));
  if (hasTitleMatch) {
    return Math.max(score, 60 + Math.round(score * 0.4));
  }

  return score;
}
