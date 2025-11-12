import { create } from "zustand";
import { getMenuTree } from "@/lib/api";

type MenuItem = {
  id: string;
  name: string;
  path: string;
  children?: MenuItem[];
};

type MenuState = {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  fetchMenu: () => Promise<void>;
  setMenuItems: (items: MenuItem[]) => void;
};

export const useMenuStore = create<MenuState>((set) => ({
  menuItems: [],
  loading: false,
  error: null,
  fetchMenu: async () => {
    try {
      const response = await getMenuTree();
      set({ menuItems: response, error: null });
    } catch (error) {
      set({ error: error.message });
      console.log("Error in fetchMenu:", error);
    } finally {
      set({ loading: false });
    }
  },
  setMenuItems: (items: MenuItem[]) => set({ menuItems: items }),
}));

type menuActiveState = {
  listItems: MenuItem[];
  setMenu: (items: MenuItem[]) => void;
};

export const useMenuActiveStore = create<menuActiveState>((set) => ({
  listItems: [],
  setMenu: (items: MenuItem[]) => set(() => ({ listItems: items })),
}));
