import { create } from 'zustand'

export const usePhoneStore = create<{
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen })
}))