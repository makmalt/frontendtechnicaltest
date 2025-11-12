/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { FolderIcon, Grid2x2Icon, Grid3x3 } from "lucide-react";
import { Sidebar, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useMenuStore } from "@/stores/menuStore";
import { useShallow } from "zustand/shallow";
import { useActiveStore } from "@/stores/activeStore";
import { useMenuActiveStore } from "@/stores/menuStore";

export function AppSidebar() {
  const { menuItems, fetchMenu, loading, error } = useMenuStore(
    useShallow((state) => ({
      menuItems: state.menuItems,
      fetchMenu: state.fetchMenu,
      loading: state.loading,
      error: state.error,
    }))
  );

  const { listItems } = useMenuActiveStore(
    useShallow((state) => ({
      listItems: state.listItems,
    }))
  );

  const { setNameActive } = useActiveStore(
    useShallow((state) => ({
      setNameActive: state.setNameActive,
    }))
  );

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleActive = (id: string, name: string) => {
    setActiveId(id);
    setNameActive(name);
  };

  const getIcon = (type: string) =>
    type === "FOLDER" ? (
      <FolderIcon className="w-6 h-6" />
    ) : (
      <Grid2x2Icon className="w-6 h-6" />
    );

  const hasVisibleChild = (menu: any): boolean => {
    if (!menu?.children || menu.children.length === 0) return false;
    return menu.children.some(
      (child: any) => child.isVisible || hasVisibleChild(child)
    );
  };

  const isMenuOrChildActive = (menu: any): boolean => {
    if (menu.id === activeId) return true;
    return (
      menu.children?.some((child: any) => isMenuOrChildActive(child)) ?? false
    );
  };

  const renderMenu = (menus: any[]) => {
    if (!menus?.length) return null;

    return (
      <SidebarMenu>
        {menus.map((menu) => {
          const visible = menu.isVisible;
          const children = menu.children ?? [];
          const hasVisibleChildren = hasVisibleChild(menu);
          const isExpandable = hasVisibleChildren;
          const isOpen = expanded[menu.id] ?? false;
          const isActive = isMenuOrChildActive(menu);

          if (!visible && hasVisibleChildren) {
            return (
              <div key={menu.id} className="ml-0">
                {renderMenu(children)}
              </div>
            );
          }

          if (!visible && !hasVisibleChildren) return null;

          const handleClick = (e: React.MouseEvent) => {
            if (isExpandable) toggleExpand(menu.id, e);
            else handleActive(menu.id, menu.name);
          };

          return (
            <SidebarMenuItem key={menu.id}>
              {/* wrapper utama */}
              <div
                className={`transition-all duration-200 overflow-hidden rounded-xl ${
                  isActive || isOpen ? "bg-blue-600 text-white" : ""
                }`}
              >
                {/* parent */}
                {visible && (
                  <div
                    onClick={handleClick}
                    className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
                      isActive ? "text-white" : "hover:bg-blue-700 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isOpen ? (
                        <FolderIcon fill="white" className="w-6 h-6" />
                      ) : (
                        getIcon(menu.iconType)
                      )}
                      <span>{menu.name}</span>
                    </div>
                  </div>
                )}

                {/* children */}
                {isExpandable && (isOpen || isActive) && (
                  <div className="space-y-1 bg-blue-600">
                    {children
                      .filter((child: any) => child.isVisible)
                      .map((child: any, index: number) => {
                        const isChildActive = isMenuOrChildActive(child);
                        const hasGrandChildren = hasVisibleChild(child);
                        const isChildOpen = expanded[child.id] ?? false;

                        return (
                          <div key={child.id}>
                            {hasGrandChildren ? (
                              <>
                                <div
                                  onClick={(e) => toggleExpand(child.id, e)}
                                  className={`flex items-center justify-between w-full px-5 py-2 text-sm transition-all cursor-pointer ${
                                    isChildActive
                                      ? "bg-blue-500 text-white"
                                      : "text-white hover:bg-blue-500"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {getIcon(child.iconType)}
                                    <span>{child.name}</span>
                                  </div>
                                </div>

                                {isChildOpen && (
                                  <div className="ml-4 mt-1 border-l border-blue-400 pl-2">
                                    {renderMenu(child.children)}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div
                                onClick={() =>
                                  handleActive(child.id, child.name)
                                }
                                className={`flex items-center gap-3 w-full px-5 py-2 text-sm transition-all cursor-pointer ${
                                  isChildActive
                                    ? "bg-blue-500 text-white"
                                    : "text-white hover:bg-blue-500"
                                }`}
                              >
                                {getIcon(child.iconType)}
                                <span>{child.name}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    );
  };

  if (error)
    return <div className="p-4 text-sm text-red-400">Error: {error}</div>;

  return (
    <Sidebar variant="floating" collapsible="offcanvas">
      <div className="flex ms-5 me-auto mt-5">
        <Grid3x3
          size={60}
          className="text-sidebar"
          strokeWidth={2}
          fill="white"
        />
        <div className="mt-1 text-xs font-semibold">
          Solusi <br /> Teknologi <br />
          Kreatif
        </div>
      </div>

      <div className="flex flex-col h-full text-white p-4 space-y-1">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-blue-800/40 rounded w-3/4" />
            <div className="h-4 bg-blue-800/40 rounded w-2/3" />
            <div className="h-4 bg-blue-800/40 rounded w-1/2" />
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-red-400">Error: {error}</div>
        ) : listItems && listItems.length > 0 ? (
          renderMenu(listItems)
        ) : menuItems && menuItems.length > 0 ? (
          renderMenu(menuItems)
        ) : (
          <div className="text-gray-400 text-sm">No menu available</div>
        )}
      </div>
    </Sidebar>
  );
}
