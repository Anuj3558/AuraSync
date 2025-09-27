"use client"

import React from "react"
import { useAppDispatch, useAppState } from "../store/AppState.jsx"

export default function CandidateList() {
  const { candidates, selectedCandidateId } = useAppState()
  const dispatch = useAppDispatch()
  const [query, setQuery] = React.useState("")
  const [sortBy, setSortBy] = React.useState("date") // 'date' | 'score'

  const filtered = candidates
    .filter((c) => [c.name, c.email].join(" ").toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "score") return b.score - a.score
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  return (
    <section className="rounded-brand border border-neutral600/10 p-4 bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold">Candidates</h2>
        <div className="flex items-center gap-2">
          <input
            className="rounded-brand border border-neutral600/20 p-2 text-sm outline-none focus:ring-2 focus:ring-brand"
            placeholder="Search name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="rounded-brand border border-neutral600/20 p-2 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Latest</option>
            <option value="score">Top Score</option>
          </select>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral600">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">Score</th>
              <th className="py-2 pr-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                onClick={() => dispatch({ type: "SELECT_CANDIDATE", payload: c.id })}
                className={`cursor-pointer hover:bg-neutral600/5 ${selectedCandidateId === c.id ? "bg-brand/10" : ""}`}
              >
                <td className="py-2 pr-4 font-medium">{c.name || "—"}</td>
                <td className="py-2 pr-4">{c.email || "—"}</td>
                <td className="py-2 pr-4">{c.phone || "—"}</td>
                <td className="py-2 pr-4 font-mono">{c.score ?? 0}</td>
                <td className="py-2 pr-4">{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-neutral600">
                  No candidates yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
