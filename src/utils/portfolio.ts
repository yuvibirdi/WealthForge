import { create } from "zustand"

export interface PortfolioState {
    totalCash: number
    propertiesOwned: number
    monthlyIncome: number
    netWorthGrowth: number
    setTotalCash: (totalCash: number) => void
    setPropertiesOwned: (propertiesOwned: number) => void
    setMonthlyIncome: (monthlyIncome: number) => void
    setNetWorthGrowth: (netWorthGrowth: number) => void
}

export const usePortfolioStore = create<PortfolioState>()((set) => ({
    totalCash: 720000,
    propertiesOwned: 0,
    monthlyIncome: 0,
    netWorthGrowth: 0,
    setTotalCash: (totalCash) => set((state) => {
        const growth = ((totalCash - state.totalCash) / state.totalCash) * 100
        return {
            totalCash,
            netWorthGrowth: Number(growth.toFixed(2))
        }
    }),
    setPropertiesOwned: (propertiesOwned) => set({ propertiesOwned }),
    setMonthlyIncome: (monthlyIncome) => set({ monthlyIncome }),
    setNetWorthGrowth: (netWorthGrowth) => set({ netWorthGrowth }),
}))