import { create } from "zustand";
import { getMenuTree } from "@/lib/api";
import { useFormStore } from "@/stores/activeStore";

export type MenuItem = {
  id: string;
  name: string;
  path?: string | null;
  depth: number;
  parentId: string | null;
  iconType?: "FOLDER" | "MENU";
  isVisible?: boolean;
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
    set({ loading: true, error: null });
    try {
      const response = await getMenuTree();
      if (!Array.isArray(response)) {
        set({ menuItems: [], loading: false });
        return;
      }
      set({
        menuItems: response,
        loading: false,
        error: null,
      });

      // refresh store lain
      useMenuActiveStore.getState().refreshList();
      useFormStore.getState().reset();
    } catch (error: any) {
      console.error("Error in fetchMenu:", error);
      set({ error: error.message ?? "Failed to fetch menus", loading: false });
    }
  },

  setMenuItems: (items: MenuItem[]) => set({ menuItems: items }),
}));

type menuActiveState = {
  listItems: MenuItem[];
  setMenu: (items: MenuItem[]) => void;
  refreshList: () => void;
};

export const useMenuActiveStore = create<menuActiveState>((set, get) => ({
  listItems: [],
  setMenu: (items) => set({ listItems: items }),
  refreshList: () => {
    const { menuItems } = useMenuStore.getState();
    const { listItems } = get();

    if (listItems.length === menuItems.length) {
      set({ listItems: menuItems });
      return;
    }

    if (listItems.length === 1) {
      const currentId = listItems[0].id;
      const updated = menuItems.find((m) => m.id === currentId);
      if (updated) {
        set({ listItems: [updated] });
      } else {
        set({ listItems: [] });
      }
    }
  },
}));
