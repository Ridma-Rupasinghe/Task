export type AgendaSession = {
  sessionId: string
  time: string
  title: string
  speaker: string
  focusKeywords: string
  description: string
}

export type GenerateInviteRequest = {
  name: string
  email: string
  focus: string
}

export type ApiSession = {
  session_id: string
  time: string
  title: string
  speaker: string
  focus_keywords: string
  description: string
}

export type GenerateInviteResponse = {
  matched_session: {
    session_id: string
    time: string
    title: string
    speaker: string
    focus_keywords: string
    description: string
    score: number
  }
  generated_email: string
}

