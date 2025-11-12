import { create } from "zustand";

type addMenuState = {
  name: string;
  depth: number;
  parentId: string | null;
  setAddMenu: (data: { depth: number; parentId: string | null }) => void;
  handleAddChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
};

export const useAddMenuStore = create<addMenuState>((set) => ({
  name: "",
  depth: 1,
  parentId: null,
  setAddMenu: (data: { depth: number; parentId: string | null }) => set(data),
  handleAddChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    set((state) => ({ ...state, [name]: value }));
  },
  reset: () => set({ name: "", depth: 1, parentId: null }),
}));
