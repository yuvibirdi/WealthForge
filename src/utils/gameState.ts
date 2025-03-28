import { create } from "zustand";
// import { persist } from "zustand/middleware"

interface Stage {
  id: StageId;
  completed: boolean;
  unlocked: boolean;
}

type StageId =
  | "house1"
  | "house2"
  | "hotdog"
  | "restaurant"
  | "stock"
  | "car"
  | "playground";

interface StageCategory {
  id: CategoryId;
  objective: string;
  minCompletions: number;
  unlocked: boolean;
  completed: boolean;
}

type CategoryId =
  | "Property Acquisition"
  | "Business Ventures"
  | "Market Trading"
  | "Asset Financing"
  | "Recreation";

interface GameState {
  lifeInsurance: boolean;
  hasStarted: boolean;
  isGameOver: boolean;
  dayCount: number;
  stages: Record<StageId, Stage>;
  categories: Record<CategoryId, StageCategory>;
  currentObjectives: CategoryId[];

  startGame: () => void;
  incrementDay: () => void;
  completeStage: (stageId: StageId) => void;
  isStageUnlocked: (stageId: StageId) => boolean;
  resetGame: () => void;
  endGame: () => void;
  buyLifeInsurance: () => void;
}

const stageCategoryMap: Record<StageId, CategoryId> = {
  house1: "Property Acquisition",
  house2: "Property Acquisition",
  hotdog: "Business Ventures",
  restaurant: "Business Ventures",
  stock: "Market Trading",
  car: "Asset Financing",
  playground: "Recreation",
};

const initialCategories: Record<CategoryId, StageCategory> = {
  "Property Acquisition": {
    id: "Property Acquisition",
    objective:
      "Build your real estate portfolio by purchasing at least one property with good ROI potential",
    minCompletions: 1,
    unlocked: true,
    completed: false,
  },
  "Business Ventures": {
    id: "Business Ventures",
    objective:
      "Diversify income through small business investments and profit-sharing agreements",
    minCompletions: 1,
    unlocked: false,
    completed: false,
  },
  "Market Trading": {
    id: "Market Trading",
    objective: "Enter the stock market and make strategic investment decisions",
    minCompletions: 1,
    unlocked: false,
    completed: false,
  },
  "Asset Financing": {
    id: "Asset Financing",
    objective:
      "Make an informed decision about vehicle financing and ownership",
    minCompletions: 1,
    unlocked: false,
    completed: false,
  },
  Recreation: {
    id: "Recreation",
    objective: "Practice financial decision-making in a risk-free environment",
    minCompletions: 0,
    unlocked: true,
    completed: false,
  },
};

const initialStages: Record<StageId, Stage> = {
  house1: { id: "house1", completed: false, unlocked: true },
  house2: { id: "house2", completed: false, unlocked: true },
  hotdog: { id: "hotdog", completed: false, unlocked: false },
  restaurant: { id: "restaurant", completed: false, unlocked: false },
  stock: { id: "stock", completed: false, unlocked: false },
  car: { id: "car", completed: false, unlocked: false },
  playground: { id: "playground", completed: false, unlocked: true },
};

const unlockNextCategories = (
  categories: Record<CategoryId, StageCategory>,
  completedCategoryId: CategoryId
): Record<CategoryId, StageCategory> => {
  const newCategories = { ...categories };

  switch (completedCategoryId) {
    case "Property Acquisition":
      newCategories["Business Ventures"].unlocked = true;
      break;
    case "Business Ventures":
      newCategories["Market Trading"].unlocked = true;
      newCategories["Asset Financing"].unlocked = true;
      break;
  }

  return newCategories;
};

const determineObjectives = (
  categories: Record<CategoryId, StageCategory>
): CategoryId[] => {
  if (
    categories["Asset Financing"].completed &&
    categories["Market Trading"].completed
  ) {
    return ["Recreation"];
  }

  const objectives: CategoryId[] = [];

  if (!categories["Property Acquisition"].completed) {
    objectives.push("Property Acquisition");
  } else if (!categories["Business Ventures"].completed) {
    objectives.push("Business Ventures");
  } else {
    if (!categories["Market Trading"].completed)
      objectives.push("Market Trading");
    if (!categories["Asset Financing"].completed)
      objectives.push("Asset Financing");
  }

  return objectives;
};

export const useGameStore = create<GameState>()(
  //   persist(
  (set) => ({
    hasStarted: false,
    isGameOver: false,
    lifeInsurance: false,
    dayCount: 0,
    stages: initialStages,
    categories: initialCategories,
    currentObjectives: determineObjectives(initialCategories),
    isStageUnlocked: (stageId: StageId) => initialStages[stageId].unlocked,

    startGame: () => set({ hasStarted: true }),

    incrementDay: () =>
      set((state) => ({
        dayCount: state.dayCount + 1,
      })),

    completeStage: (stageId) =>
      set((state) => {
        const newStages = {
          ...state.stages,
          [stageId]: { ...state.stages[stageId], completed: true },
        };

        // Check if category is completed
        const categoryId = stageCategoryMap[stageId];
        const categoryStages = Object.entries(stageCategoryMap)
          .filter(([, catId]) => catId === categoryId)
          .map(([stageId]) => newStages[stageId as StageId]);

        const completedCount = categoryStages.filter(
          (stage) => stage.completed
        ).length;
        const category = state.categories[categoryId];

        const newCategories = {
          ...state.categories,
          [categoryId]: {
            ...category,
            completed: completedCount >= category.minCompletions,
          },
        };

        const updatedCategories = unlockNextCategories(
          newCategories,
          categoryId
        );

        return {
          stages: newStages,
          categories: updatedCategories,
          currentObjectives: determineObjectives(updatedCategories),
        };
      }),

    unlockCategory: (categoryId: CategoryId) =>
      set((state) => {
        const newStages = { ...state.stages };
        for (const [stageId, catId] of Object.entries(stageCategoryMap)) {
          if (catId === categoryId) {
            newStages[stageId as StageId].unlocked = true;
          }
        }

        const newCategories = {
          ...state.categories,
          [categoryId]: {
            ...state.categories[categoryId],
            unlocked: true,
          },
        };

        return {
          stages: newStages,
          categories: newCategories,
        };
      }),

    resetGame: () =>
      set({
        hasStarted: false,
        dayCount: 0,
        stages: initialStages,
        categories: initialCategories,
        currentObjectives: determineObjectives(initialCategories),
      }),
    endGame: () => set({ isGameOver: true }),
    buyLifeInsurance: () => set({ lifeInsurance: true }),
  })
);
//     {
//         name: 'game-storage'
//         }
//     )
// )

export const getCategoryProgress = (
  stages: Record<StageId, Stage>,
  categoryId: CategoryId
): { completed: number; total: number } => {
  const categoryStages = Object.entries(stageCategoryMap)
    .filter(([, catId]) => catId === categoryId)
    .map(([stageId]) => stages[stageId as StageId]);

  return {
    completed: categoryStages.filter((stage) => stage.completed).length,
    total: categoryStages.length,
  };
};
