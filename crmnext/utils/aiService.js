// wrapper around your LLM service
export async function callAiSummary({ summary, timeline }) {
  // e.g. call OpenAI or other LLM endpoint
  const prompt = `
      Summary: ${summary}
      Events: ${timeline.join("; ")}
      Write a one-line summary:
    `;
  // fetch to LLM…
  return "Escrow was created on June 1st and is pending release upon delivery confirmation.";
}
