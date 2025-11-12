import { create } from "zustand";

type activeState = {
  name: string;
  setName: (name: string) => void;
};

export const useActiveStore = create<activeState>((set) => ({
  name: "Systems",
  setName: (name: string) => set({ name }),
}));

type formState = {
  id: string;
  depth: number | null;
  parentId: string | null;
  nameMenu: string;
  setForm: (form: {
    id: string;
    depth: number | null;
    parentId: string | null;
    nameMenu: string;
  }) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const useFormStore = create<formState>((set) => ({
  id: "",
  depth: null,
  parentId: "",
  nameMenu: "",
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
}));
