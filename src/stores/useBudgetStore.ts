import { useState, useEffect } from 'react'

export interface ClientData {
  cnpj?: string
  razaoSocial?: string
  [key: string]: any
}

export interface EquipmentData {
  id: string
  type: string
  method?: string
  data?: Record<string, any>
}

const initialState = {
  client: {} as ClientData,
  equipments: [] as EquipmentData[],
  files: [] as File[],
  aiPrompt: '',
  aiImage: null as string | null,
  aiImageStatus: 'idle' as 'idle' | 'generating' | 'success' | 'error',
  quoteId: null as string | null,
  quoteStatus: 'briefing',
  engineeringDeadline: null as string | null,
  isReviewing: false,
  aiJustification: '',
  aiComments: '',
}

let state = { ...initialState }
const listeners = new Set<() => void>()

function setState(newState: Partial<typeof state>) {
  let hasChanges = false
  const nextState = { ...state }

  // Comparação profunda para objetos e arrays (exceto arquivos) para impedir erro "Maximum update depth exceeded"
  for (const key in newState) {
    const k = key as keyof typeof state
    const newVal = newState[k]
    const oldVal = nextState[k]

    if (k === 'files') {
      if (newVal !== oldVal) {
        nextState[k] = newVal as any
        hasChanges = true
      }
    } else if (typeof newVal === 'object' && newVal !== null) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        nextState[k] = newVal as any
        hasChanges = true
      }
    } else if (oldVal !== newVal) {
      nextState[k] = newVal as any
      hasChanges = true
    }
  }

  if (!hasChanges) return

  state = nextState
  listeners.forEach((listener) => listener())
}

export const budgetActions = {
  setClient: (client: ClientData) => setState({ client }),
  addEquipment: (eq: EquipmentData) => setState({ equipments: [...state.equipments, eq] }),
  removeEquipment: (id: string) =>
    setState({ equipments: state.equipments.filter((e) => e.id !== id) }),
  updateEquipment: (id: string, data: Partial<EquipmentData>) =>
    setState({
      equipments: state.equipments.map((e) => (e.id === id ? { ...e, ...data } : e)),
    }),
  addFiles: (newFiles: File[]) => setState({ files: [...state.files, ...newFiles] }),
  setAiPrompt: (aiPrompt: string) => setState({ aiPrompt }),
  setAiImage: (aiImage: string | null) => setState({ aiImage }),
  setAiImageStatus: (aiImageStatus: typeof state.aiImageStatus) => setState({ aiImageStatus }),
  setQuoteId: (quoteId: string | null) => setState({ quoteId }),
  setQuoteStatus: (quoteStatus: string) => setState({ quoteStatus }),
  setEngineeringDeadline: (engineeringDeadline: string | null) => setState({ engineeringDeadline }),
  setIsReviewing: (isReviewing: boolean) => setState({ isReviewing }),
  setAiJustification: (aiJustification: string) => setState({ aiJustification }),
  setAiComments: (aiComments: string) => setState({ aiComments }),
  reset: () => setState({ ...initialState }),
}

export const useBudgetStore = () => {
  const [localState, setLocalState] = useState(state)

  useEffect(() => {
    const listener = () => setLocalState(state)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return {
    ...localState,
    ...budgetActions,
  }
}

export default useBudgetStore
