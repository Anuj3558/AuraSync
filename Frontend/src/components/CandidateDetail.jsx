import { useAppState } from "../store/AppState.jsx"

export default function CandidateDetail() {
  const { candidates, selectedCandidateId } = useAppState()
  const selected = candidates.find((c) => c.id === selectedCandidateId)

  if (!selected) {
    return (
      <section className="rounded-brand border border-neutral600/10 p-4 bg-white">
        <h2 className="text-lg font-semibold mb-2">Details</h2>
        <p className="text-sm text-neutral600">Select a candidate to view details.</p>
      </section>
    )
  }

  return (
    <section className="rounded-brand border border-neutral600/10 p-4 bg-white">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h2 className="text-lg font-semibold">{selected.name || "Unnamed Candidate"}</h2>
          <p className="text-sm text-neutral600">
            {selected.email} • {selected.phone}
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-brand bg-brand text-white text-sm font-medium">
          Score: {selected.score}/100
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-1">AI Summary</h3>
        <p className="text-sm">{selected.summary}</p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Q&A</h3>
        <ul className="space-y-3">
          {selected.qa?.map((item, idx) => (
            <li key={idx} className="border border-neutral600/10 rounded-brand p-3">
              <p className="text-sm">
                <span className="font-medium">Q{idx + 1}:</span> {item.question}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">A:</span> {item.answer || <em className="text-neutral600">No answer</em>}
              </p>
              <p className="text-xs mt-1 text-neutral600">
                Score: <span className="font-mono">{item.score}/10</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
