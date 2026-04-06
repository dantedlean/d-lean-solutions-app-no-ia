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

let state = {
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

const listeners = new Set<() => void>()

function setState(newState: Partial<typeof state>) {
  state = { ...state, ...newState }
  listeners.forEach((listener) => listener())
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
    setEngineeringDeadline: (engineeringDeadline: string | null) =>
      setState({ engineeringDeadline }),
    setIsReviewing: (isReviewing: boolean) => setState({ isReviewing }),
    setAiJustification: (aiJustification: string) => setState({ aiJustification }),
    setAiComments: (aiComments: string) => setState({ aiComments }),
    reset: () =>
      setState({
        client: {},
        equipments: [],
        files: [],
        aiPrompt: '',
        aiImage: null,
        aiImageStatus: 'idle',
        quoteId: null,
        quoteStatus: 'briefing',
        engineeringDeadline: null,
        isReviewing: false,
        aiJustification: '',
        aiComments: '',
      }),
  }
}

export default useBudgetStore
