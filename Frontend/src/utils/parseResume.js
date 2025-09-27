export async function parseFromText(text) {
  const name = extractName(text)
  const email = extractEmail(text)
  const phone = extractPhone(text)
  return { name, email, phone }
}

export async function parseFromFile(file) {
  // Minimal fallback: attempt to read as text
  const text = await file.text().catch(() => "")
  return parseFromText(text || "")
}

function extractName(text) {
  const firstLine =
    (text || "")
      .split(/\n/)
      .map((s) => s.trim())
      .find(Boolean) || ""
  // Assume name-like pattern: Two words capitalized
  const m = firstLine.match(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/)
  return m ? m[0] : ""
}

function extractEmail(text) {
  const m = (text || "").match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)
  return m ? m[0] : ""
}

function extractPhone(text) {
  const m = (text || "").match(/(\+?\d{1,3}[-.\s]?)?\d{10}/)
  return m ? m[0] : ""
}
