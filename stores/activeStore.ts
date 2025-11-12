import { create } from "zustand";

type activeState = {
  nameActive: string;
  setNameActive: (nameActive: string) => void;
};

export const useActiveStore = create<activeState>((set) => ({
  nameActive: "Systems",
  setNameActive: (nameActive: string) => set({ nameActive }),
}));

type formState = {
  id: string;
  depth: number | null;
  parentId: string | null;
  nameMenu: string;
  activeNodeId: string | null;
  setForm: (form: {
    id: string;
    depth: number | null;
    parentId: string | null;
    nameMenu: string;
    activeNodeId: string | null;
  }) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
};

export const useFormStore = create<formState>((set) => ({
  id: "",
  depth: null,
  parentId: null,
  nameMenu: "",
  activeNodeId: null,
  setForm: (data: {
    id: string;
    depth: number | null;
    parentId: string | null;
    nameMenu: string;
  }) => set(data),
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    set((state) => ({ ...state, [name]: value }));
  },
  reset: () =>
    set({
      id: "",
      depth: null,
      parentId: null,
      nameMenu: "",
      activeNodeId: null,
    }),
}));
