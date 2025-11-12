/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { FolderIcon, Grid2x2Icon, ChevronRight } from "lucide-react";
import { Sidebar, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useMenuStore } from "@/stores/menuStore";
import { useShallow } from "zustand/shallow";
import { useActiveStore } from "@/stores/activeStore";

export function AppSidebar() {
  const { menuItems, fetchMenu, loading, error } = useMenuStore(
    useShallow((state) => ({
      menuItems: state.menuItems,
      fetchMenu: state.fetchMenu,
      loading: state.loading,
      error: state.error,
    }))
  );

  const { setName } = useActiveStore(
    useShallow((state) => ({
      setName: state.setName,
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
    setName(name);
  };

  const getIcon = (type: string) =>
    type === "FOLDER" ? (
      <FolderIcon className="w-4 h-4" />
    ) : (
      <Grid2x2Icon className="w-4 h-4" />
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
            else setActiveId(menu.id);
          };

          return (
            <SidebarMenuItem key={menu.id}>
              <div
                className={`transition-all duration-200 rounded-2xl overflow-hidden ${
                  isActive ? "bg-blue-600 text-white" : ""
                }`}
              >
                {/* parent */}
                {visible && (
                  <div
                    onClick={handleClick}
                    className={`flex items-center justify-between w-full px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all ${
                      isActive ? "text-white" : "hover:bg-blue-700 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getIcon(menu.iconType)}
                      <span>{menu.name}</span>
                    </div>
                  </div>
                )}

                {isExpandable && (isOpen || isActive) && (
                  <div
                    className={`mt-1 p-2 space-y-1 rounded-2xl ${
                      isActive ? "bg-blue-600" : "bg-blue-700/40"
                    }`}
                  >
                    {children
                      .filter((child: any) => child.isVisible)
                      .map((child: any) => {
                        const isChildActive = isMenuOrChildActive(child);
                        const hasGrandChildren = hasVisibleChild(child);
                        const isChildOpen = expanded[child.id] ?? false;

                        return (
                          <div key={child.id}>
                            {hasGrandChildren ? (
                              <>
                                <div
                                  onClick={(e) => toggleExpand(child.id, e)}
                                  className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-all cursor-pointer ${
                                    isChildActive
                                      ? "bg-blue-500 text-white"
                                      : "text-white hover:bg-blue-500"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {getIcon(child.iconType)}
                                    <span>{child.name}</span>
                                  </div>
                                  <ChevronRight
                                    size={14}
                                    className={`transition-transform duration-200 ${
                                      isChildOpen ? "rotate-90" : ""
                                    }`}
                                  />
                                </div>

                                {isChildOpen && (
                                  <div className="ml-4 mt-1 border-l border-blue-400 pl-2">
                                    {renderMenu(child.children)}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div
                                // onClick={() => setActiveId(child.id)}
                                onClick={() =>
                                  handleActive(child.id, child.name)
                                }
                                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-all cursor-pointer ${
                                  isChildActive
                                    ? "bg-white text-blue-700"
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

  if (loading)
    return <div className="p-4 text-sm text-gray-400">Loading menus...</div>;
  if (error)
    return <div className="p-4 text-sm text-red-400">Error: {error}</div>;

  return (
    <Sidebar variant="floating" collapsible="offcanvas">
      <div className="flex flex-col h-full text-white p-4 space-y-1">
        {menuItems && menuItems.length > 0 ? (
          renderMenu(menuItems)
        ) : (
          <div className="text-gray-400 text-sm">No menu available</div>
        )}
      </div>
    </Sidebar>
  );
}
