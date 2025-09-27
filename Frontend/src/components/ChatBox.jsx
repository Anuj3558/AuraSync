// "use client"

// import React from "react"
// import Timer from "./Timer.jsx"
// import { useAppDispatch, useAppState } from "../store/AppState.jsx"
// import { getQuestionByDifficulty, scoreAnswer, summarizeCandidate } from "../utils/api.js"

// const TIME_BY_DIFF = { easy: 20, medium: 60, hard: 120 }

// export default function ChatBox() {
//   const { currentCandidate, interview } = useAppState()
//   const dispatch = useAppDispatch()
//   const [answer, setAnswer] = React.useState("")

//   const currentDifficulty = interview.difficultyPlan[interview.currentIndex]
//   const timeForQuestion = TIME_BY_DIFF[currentDifficulty] || 30

//   React.useEffect(() => {
//     // Start new interview or push first question
//     if (interview.status === "idle") return
//     if (interview.currentIndex >= interview.difficultyPlan.length) return
//     const alreadyAsked = interview.chat.some((m) => m.role === "system" && m.meta?.idx === interview.currentIndex)
//     if (!alreadyAsked) {
//       const q = getQuestionByDifficulty(currentDifficulty)
//       dispatch({
//         type: "PUSH_CHAT",
//         payload: { role: "system", content: q, meta: { idx: interview.currentIndex, difficulty: currentDifficulty } },
//       })
//     }
//   }, [
//     interview.status,
//     interview.currentIndex,
//     currentDifficulty,
//     dispatch,
//     interview.chat,
//     interview.difficultyPlan.length,
//   ])

//   function nextStep(prevQuestion, userAnswer) {
//     const score = scoreAnswer(prevQuestion, userAnswer)
//     dispatch({ type: "ADD_QA", payload: { question: prevQuestion, answer: userAnswer, score } })

//     const nextIdx = interview.currentIndex + 1
//     if (nextIdx < interview.difficultyPlan.length) {
//       dispatch({ type: "SET_INDEX", payload: nextIdx })
//       setAnswer("")
//     } else {
//       // Finish interview: compute totals and summary
//       const total = Math.min(
//         100,
//         Math.round(
//           [...interview.qa, { question: prevQuestion, answer: userAnswer, score }].reduce(
//             (sum, x) => sum + x.score,
//             0,
//           ) *
//             (100 / (interview.difficultyPlan.length * 10)),
//         ),
//       )
//       const summary = summarizeCandidate(
//         currentCandidate.name,
//         [...interview.qa, { question: prevQuestion, answer: userAnswer, score }],
//         total,
//       )
//       dispatch({ type: "FINISH_INTERVIEW", payload: { summary, totalScore: total } })
//       dispatch({ type: "SAVE_CANDIDATE_RESULT" })
//     }
//   }

//   function handleSubmit() {
//     const lastQ = interview.chat.filter((m) => m.role === "system").slice(-1)[0]?.content || ""
//     if (!answer.trim()) return
//     dispatch({ type: "PUSH_CHAT", payload: { role: "user", content: answer } })
//     nextStep(lastQ, answer.trim())
//   }

//   function handleTimeout() {
//     const lastQ = interview.chat.filter((m) => m.role === "system").slice(-1)[0]?.content || ""
//     dispatch({ type: "PUSH_CHAT", payload: { role: "user", content: "[No answer submitted - timed out]" } })
//     nextStep(lastQ, "")
//   }

//   const canStart = currentCandidate.name && currentCandidate.email && currentCandidate.phone

//   return (
//     <section className="rounded-brand border border-neutral600/10 p-4 md:p-6 bg-white">
//       <div className="flex items-center justify-between mb-3">
//         <h2 className="text-lg font-semibold">Interview Chat</h2>
//         {interview.status !== "running" && (
//           <button
//             className="px-4 py-2 rounded-brand bg-brand text-white text-sm font-medium disabled:opacity-50"
//             onClick={() => dispatch({ type: "START_INTERVIEW" })}
//             disabled={!canStart}
//           >
//             Start Interview
//           </button>
//         )}
//       </div>

//       {!canStart && (
//         <p className="text-sm text-accent mb-4">Please complete your name, email, and phone before starting.</p>
//       )}

//       <div className="space-y-3">
//         <div className="border border-neutral600/10 rounded-brand p-3 max-h-80 overflow-auto">
//           {interview.chat.length === 0 && <p className="text-sm text-neutral600">No messages yet.</p>}
//           <ul className="space-y-2">
//             {interview.chat.map((m, i) => (
//               <li key={i} className={`p-2 rounded-brand ${m.role === "system" ? "bg-neutral600/5" : "bg-brand/10"}`}>
//                 <p className="text-sm">
//                   <span className="font-medium">{m.role === "system" ? "Interviewer" : "You"}: </span>
//                   <span>{m.content}</span>
//                 </p>
//                 {m.meta?.difficulty && <p className="text-xs text-neutral600 mt-1">Difficulty: {m.meta.difficulty}</p>}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {interview.status === "running" && interview.currentIndex < interview.difficultyPlan.length && (
//           <div className="space-y-3">
//             <Timer seconds={timeForQuestion} onTimeout={handleTimeout} running />
//             <div className="flex items-start gap-2">
//               <textarea
//                 className="flex-1 min-h-24 rounded-brand border border-neutral600/20 p-3 outline-none focus:ring-2 focus:ring-brand"
//                 placeholder="Type your answer here..."
//                 value={answer}
//                 onChange={(e) => setAnswer(e.target.value)}
//               />
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 rounded-brand bg-brand text-white text-sm font-medium self-stretch"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         )}

//         {interview.status === "complete" && (
//           <div className="rounded-brand border border-neutral600/10 p-4 bg-neutral600/5">
//             <h3 className="font-semibold mb-1">Interview Complete</h3>
//             <p className="text-sm mb-2">
//               Total Score: <span className="font-mono">{interview.totalScore}/100</span>
//             </p>
//             <p className="text-sm text-neutral900">{interview.summary}</p>
//             <div className="mt-3">
//               <button
//                 className="px-4 py-2 rounded-brand bg-neutral600/20 text-neutral900 text-sm font-medium"
//                 onClick={() => {
//                   // reset interview to allow retry
//                   // keep candidate info
//                   window.scrollTo({ top: 0, behavior: "smooth" })
//                   setTimeout(() => {
//                     // ensure scroll then reset
//                   }, 0)
//                   // hard reset interview state
//                   location.href = "/interviewer" // navigate recruiter to see result
//                 }}
//               >
//                 View in Interviewer Dashboard
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   )
// }
