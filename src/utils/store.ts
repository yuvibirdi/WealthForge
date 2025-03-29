import { create } from "zustand"
import type { PortfolioState } from "./portfolio"

export interface DialogOption {
    text: string
    next?: Dialog | null
    action?: () => void
    type?: 'default' | 'slider'
    min?: number
    max?: number
    minLabel?: string
    maxLabel?: string
    sliderValue?: number
    onEnd?: () => void
}

export interface Dialog {
    text: string
    stage: string
    character: string
    next?: Dialog | null
    options?: DialogOption[]
    onEnd?: (portfolioStore: PortfolioState) => void
}

interface DialogState {
    currentDialog: Dialog | null
    dialogHistory: Dialog[]
    sliderValues: Record<string, number> // Stores slider values by key
    setDialog: (dialog: Dialog | null) => void
    selectOption: (option: DialogOption) => void
    setSliderValue: (key: string, value: number) => void
    clearDialog: () => void
}

export const useDialogStore = create<DialogState>()((set) => ({
    currentDialog: null,
    dialogHistory: [],
    sliderValues: {}, // Store slider values

    // Set the current dialog
    setDialog: (dialog) => set({ currentDialog: dialog }),

    // Select an option and transition to the next dialog or execute an action
    selectOption: (option) =>
        set((state) => {
            if (option.action) {
                option.action(); // Execute option's action
            }
            return {
                currentDialog: option.next || null, // Move to the next dialog, or clear if no next exists
                dialogHistory: state.currentDialog
                    ? [...state.dialogHistory, state.currentDialog]
                    : state.dialogHistory, // Keep history of visited dialogs
            };
        }),

    // Update a specific slider value by key
    setSliderValue: (key, value) =>
        set((state) => ({
            sliderValues: {
                ...state.sliderValues,
                [key]: value,
            },
        })),

    // Clear the dialog and reset history and slider values
    clearDialog: () =>
        set({ currentDialog: null, dialogHistory: [], sliderValues: {} }),
}));
