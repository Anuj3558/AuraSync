"use client"

import React from "react"
import { useAppDispatch, useAppState } from "../store/AppState.jsx"
import { parseFromText, parseFromFile } from "../utils/parseResume.js"

export default function ResumeUpload() {
  const dispatch = useAppDispatch()
  const { currentCandidate } = useAppState()
  const [text, setText] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  async function handleParseText() {
    setError("")
    setLoading(true)
    try {
      const data = await parseFromText(text)
      dispatch({ type: "SET_CANDIDATE", payload: data })
    } catch {
      setError("Could not parse the pasted content.")
    } finally {
      setLoading(false)
    }
  }

  async function handleFile(e) {
    setError("")
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const data = await parseFromFile(file)
      dispatch({ type: "SET_CANDIDATE", payload: data })
    } catch {
      setError("Only basic text parsing is supported in-browser.")
    } finally {
      setLoading(false)
    }
  }

  function updateField(field, value) {
    dispatch({ type: "SET_CANDIDATE", payload: { [field]: value } })
  }

  return (
    <section className="rounded-brand border border-neutral600/10 p-4 md:p-6 bg-white">
      <h2 className="text-lg font-semibold mb-2 text-balance">Resume & Details</h2>
      <p className="text-sm text-neutral600 mb-4">
        Paste your resume text or upload a file, then confirm your details.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="block text-sm font-medium">Paste Resume Text</label>
          <textarea
            className="w-full min-h-32 rounded-brand border border-neutral600/20 p-3 outline-none focus:ring-2 focus:ring-brand"
            placeholder="Paste resume content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleParseText}
              disabled={loading || !text.trim()}
              className="px-4 py-2 rounded-brand bg-brand text-white text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Parsing..." : "Parse Text"}
            </button>
            <label className="text-sm text-neutral600">
              or upload file:
              <input type="file" className="block mt-1 text-sm" onChange={handleFile} />
            </label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              className="w-full rounded-brand border border-neutral600/20 p-2 outline-none focus:ring-2 focus:ring-brand"
              value={currentCandidate.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className="w-full rounded-brand border border-neutral600/20 p-2 outline-none focus:ring-2 focus:ring-brand"
              value={currentCandidate.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              className="w-full rounded-brand border border-neutral600/20 p-2 outline-none focus:ring-2 focus:ring-brand"
              value={currentCandidate.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+1 555 123 4567"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
