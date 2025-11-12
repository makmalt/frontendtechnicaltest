"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Grid2x2 } from "lucide-react";
import { useMenuStore, useMenuActiveStore } from "@/stores/menuStore";
import { useShallow } from "zustand/shallow";
import { useActiveStore, useFormStore } from "@/stores/activeStore";
import { AppSelect as Select } from "@/components/app-select";
import { createMenu } from "@/lib/api";
import Modal from "@/components/modal";
import { Input } from "@/components/ui/input";
import FormPage from "@/components/formPage";
import { Button } from "@/components/ui/button";

export default function MenuTree() {
  const [openModal, setOpenModal] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set()); // ✅ track expanded nodes

  const { menuItems, fetchMenu, loading, error } = useMenuStore(
    useShallow((state) => ({
      menuItems: state.menuItems,
      fetchMenu: state.fetchMenu,
      loading: state.loading,
      error: state.error,
    }))
  );

  const { listItems, setMenu } = useMenuActiveStore(
    useShallow((state) => ({
      listItems: state.listItems,
      setMenu: state.setMenu,
    }))
  );

  const { name } = useActiveStore(
    useShallow((state) => ({
      name: state.name,
    }))
  );

  const { id, depth, parentId, nameMenu, handleChange } = useFormStore(
    useShallow((state) => ({
      id: state.id,
      depth: state.depth,
      parentId: state.parentId,
      nameMenu: state.nameMenu,
      handleChange: state.handleChange,
    }))
  );

  const handleSubmitMenu = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingModal(true);

    const newParentMenu = {
      id: crypto.randomUUID(),
      name: formData.name,
      depth: 1,
      isVisible: false,
      parentId: null,
      iconType: "FOLDER",
    };
    createMenu(newParentMenu)
      .then(() => {
        fetchMenu();
        setLoadingModal(false);
        setOpenModal(false);
        setFormData({ name: "" });
      })
      .catch((err) => {
        console.error("Error creating menu:", err);
      });
  };

  useEffect(() => {
    if (menuItems.length === 0) fetchMenu();
  }, [fetchMenu, menuItems]);

  const handleExpandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (menus: any[]) => {
      menus.forEach((menu) => {
        allIds.add(menu.id);
        if (menu.children?.length) collectIds(menu.children);
      });
    };
    collectIds(menuItems);
    setExpandedNodes(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  if (loading)
    return <div className="p-6 text-gray-400 text-sm">Loading menus...</div>;
  if (error)
    return <div className="p-6 text-red-400 text-sm">Error: {error}</div>;

  return (
    <div className=" w-screen max-w-6xl mx-auto p-6 bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="gap-2 hidden md:flex">
            <Grid2x2
              size={40}
              className="p-2 border rounded-full bg-[#0C49B0] text-white"
            />
            <h1 className=" text-2xl font-semibold text-gray-800 mb-2">
              {name}
            </h1>
          </div>

          <span className="text-gray-600 text-sm mb-2">Menu</span>
          <Select
            options={[
              { value: "all", label: "Tampilkan Semua" },
              ...menuItems.map((menu) => ({
                value: menu.id,
                label: menu.name,
              })),
            ]}
            onValueChange={(id) => {
              if (id === "all") {
                setMenu(menuItems);
                return;
              }

              const selectedMenu = menuItems.find((menu) => menu.id === id);
              if (selectedMenu) {
                setMenu([selectedMenu]);
              }
            }}
            placeholder="Select a menu"
            onAdd={() => setOpenModal(true)}
          />

          <div className="flex gap-3 mt-2">
            <Button
              onClick={handleExpandAll}
              className="bg-slate-700 hover:bg-slate-800 text-white rounded-full"
            >
              Expand All
            </Button>
            <Button
              variant="outline"
              onClick={handleCollapseAll}
              className="text-gray-700 border-gray-300 rounded-full"
            >
              Collapse All
            </Button>
          </div>

          <div className="space-y-2 overflow-y-auto pt-2 max-h-[calc(100vh-12rem)]">
            {(listItems?.length > 0 ? listItems : menuItems).map((menu) => (
              <MenuNode
                key={menu.id}
                node={menu}
                level={0}
                expandedNodes={expandedNodes}
                setExpandedNodes={setExpandedNodes}
              />
            ))}
          </div>

          {openModal && (
            <Modal
              title="Add New Menu"
              setOpenModal={() => setOpenModal(false)}
              handleSubmit={handleSubmitMenu}
              tombol={"Simpan"}
              loading={loadingModal}
            >
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Modal>
          )}
        </div>

        <div className="space-y-4">
          <FormPage
            id={id}
            depth={depth}
            parentId={parentId}
            nameMenu={nameMenu}
            handleChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

function MenuNode({
  node,
  level,
  expandedNodes,
  setExpandedNodes,
}: {
  node: any;
  level: number;
  expandedNodes: Set<string>;
  setExpandedNodes: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const expanded = expandedNodes.has(node.id);

  const { setForm } = useFormStore(
    useShallow((state) => ({
      setForm: state.setForm,
    }))
  );

  const handleToggle = () => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (expanded) newSet.delete(node.id);
      else newSet.add(node.id);
      return newSet;
    });
  };

  const handleClick = () => {
    setForm({
      id: node.id,
      depth: node.depth,
      parentId: node.parentId,
      nameMenu: node.name,
    });
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className="flex items-center gap-2 py-1.5 cursor-pointer rounded-md hover:bg-gray-100 transition"
        style={{ paddingLeft: `${level * 16}px` }}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown
              className="w-4 h-4 text-gray-600"
              onClick={handleToggle}
            />
          ) : (
            <ChevronRight
              className="w-4 h-4 text-gray-600"
              onClick={handleToggle}
            />
          )
        ) : (
          <div className="w-4" />
        )}

        <span
          onClick={handleClick}
          className="text-gray-800 text-sm font-medium truncate"
        >
          {node.name}
        </span>
        <span className="flex items-center justify-center w-5 h-5 border border-gray-400 rounded-full bg-white hover:bg-gray-100 cursor-pointer p-1 pt-0">
          +
        </span>
      </div>

      {hasChildren && expanded && (
        <div className="mt-1 border-l border-gray-200">
          {node.children.map((child: any) => (
            <MenuNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              setExpandedNodes={setExpandedNodes}
            />
          ))}
        </div>
      )}
    </div>
  );
}
