"use client"

import React from "react"

const initialState = {
  currentCandidate: {
    id: null,
    name: "",
    email: "",
    phone: "",
  },
  interview: {
    status: "idle", // idle | running | complete
    difficultyPlan: ["easy", "easy", "medium", "medium", "hard", "hard"],
    currentIndex: 0,
    currentSeconds: 0,
    chat: [], // { role: 'system'|'user', content: string }
    qa: [], // [{ question, answer, score }]
    summary: "",
    totalScore: 0,
  },
  candidates: [], // completed interviews
  selectedCandidateId: null,
}

const AppStateContext = React.createContext(undefined)
const AppDispatchContext = React.createContext(undefined)
const STORAGE_KEY = "aurasync_state_v1"

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw)
    return { ...initialState, ...parsed }
  } catch {
    return initialState
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_CANDIDATE":
      return persist({
        ...state,
        currentCandidate: { ...state.currentCandidate, ...action.payload },
      })
    case "RESET_INTERVIEW":
      return persist({
        ...state,
        interview: { ...initialState.interview },
      })
    case "START_INTERVIEW":
      return persist({
        ...state,
        interview: {
          ...state.interview,
          status: "running",
          currentIndex: 0,
          chat: [],
          qa: [],
          summary: "",
          totalScore: 0,
        },
      })
    case "PUSH_CHAT":
      return persist({
        ...state,
        interview: {
          ...state.interview,
          chat: [...state.interview.chat, action.payload], // {role, content}
        },
      })
    case "ADD_QA":
      return persist({
        ...state,
        interview: {
          ...state.interview,
          qa: [...state.interview.qa, action.payload], // {question, answer, score}
        },
      })
    case "SET_INDEX":
      return persist({
        ...state,
        interview: { ...state.interview, currentIndex: action.payload },
      })
    case "FINISH_INTERVIEW":
      return persist({
        ...state,
        interview: {
          ...state.interview,
          status: "complete",
          summary: action.payload.summary,
          totalScore: action.payload.totalScore,
        },
      })
    case "SAVE_CANDIDATE_RESULT": {
      const id = crypto.randomUUID()
      const record = {
        id,
        name: state.currentCandidate.name,
        email: state.currentCandidate.email,
        phone: state.currentCandidate.phone,
        score: state.interview.totalScore,
        summary: state.interview.summary,
        chatHistory: state.interview.chat,
        qa: state.interview.qa,
        createdAt: new Date().toISOString(),
      }
      return persist({
        ...state,
        candidates: [record, ...state.candidates],
        selectedCandidateId: id,
      })
    }
    case "SELECT_CANDIDATE":
      return persist({ ...state, selectedCandidateId: action.payload })
    default:
      return state
  }
}

function persist(state) {
  saveState(state)
  return state
}

export function AppProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, undefined, loadState)

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = React.useContext(AppStateContext)
  if (!ctx) throw new Error("useAppState must be used within AppProvider")
  return ctx
}

export function useAppDispatch() {
  const ctx = React.useContext(AppDispatchContext)
  if (!ctx) throw new Error("useAppDispatch must be used within AppProvider")
  return ctx
}
