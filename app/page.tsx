"use client";

import { useState, useEffect } from "react";
import { LayoutGrid } from "lucide-react";
import { useMenuStore, useMenuActiveStore, MenuItem } from "@/stores/menuStore";
import { useShallow } from "zustand/shallow";
import { useActiveStore, useFormStore } from "@/stores/activeStore";
import { AppSelect as Select } from "@/components-mainpage/app-select";
import { createMenu } from "@/lib/api";
import Modal from "@/components/modal";
import { Input } from "@/components/ui/input";
import FormPage from "@/components-mainpage/formPage";
import { Button } from "@/components/ui/button";
import MenuNode from "@/components-mainpage/menuNode";
import { useAddMenuStore } from "@/stores/addMenuStore";

export default function MenuTree() {
  const [openModal, setOpenModal] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const { name, handleAddChange, reset } = useAddMenuStore(
    useShallow((state) => ({
      name: state.name,
      handleAddChange: state.handleAddChange,
      reset: state.reset,
    }))
  );
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

  const { nameActive } = useActiveStore(
    useShallow((state) => ({
      nameActive: state.nameActive,
    }))
  );

  //state buat isi data di form sebelah kanan
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
      name: name,
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
        reset();
      })
      .catch((err) => {
        console.error("Error creating menu:", err);
      });
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleExpandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (menus: MenuItem[]) => {
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

  if (error)
    return <div className="p-6 text-red-400 text-sm">Error: {error}</div>;

  return (
    <div className="w-screen max-w-6xl mx-auto p-6 bg-transparent min-h-[calc(100vh-3rem)]">
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-3rem)]">
        {/* kiri */}
        <div className="flex flex-col w-full md:w-1/2 space-y-4 md:overflow-hidden">
          <div className="gap-2 hidden md:flex">
            <LayoutGrid
              strokeWidth={0.75}
              fill="white"
              size={40}
              className="p-2 border rounded-full bg-[#0C49B0] text-white"
            />
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              {nameActive || "Menu Management"}
            </h1>
          </div>

          <span className="text-gray-600 text-sm mb-2">Menu</span>

          <Select
            open={openSelect}
            onOpenChange={setOpenSelect}
            options={[
              { value: "all", label: "Display All" },
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
            onAdd={() => {
              setOpenSelect(false);
              setOpenModal(true);
            }}
          />

          <div className="flex gap-3 mt-2">
            <Button
              onClick={handleExpandAll}
              className="bg-slate-700 hover:bg-slate-800 text-white rounded-full cursor-pointer"
            >
              Expand All
            </Button>
            <Button
              variant="outline"
              onClick={handleCollapseAll}
              className="text-gray-700 border-gray-300 rounded-full cursor-pointer"
            >
              Collapse All
            </Button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pt-2 space-y-2">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-white rounded w-3/4" />
              </div>
            ) : menuItems.length === 0 ? (
              <div className="p-6 text-gray-400 text-sm">No menus found.</div>
            ) : (
              (listItems?.length > 0 ? listItems : menuItems).map((menu) => (
                <MenuNode
                  key={menu.id}
                  node={menu}
                  level={0}
                  expandedNodes={expandedNodes}
                  setExpandedNodes={setExpandedNodes}
                />
              ))
            )}
          </div>

          {/* modal tambah menu root*/}
          {openModal && (
            <Modal
              title="Add New Menu"
              setOpenModal={() => setOpenModal(false)}
              handleSubmit={handleSubmitMenu}
              tombol={"Save"}
              loading={loadingModal}
              variant={"default"}
            >
              <label htmlFor="name">Menu Name (root)</label>
              <Input
                type="text"
                name="name"
                value={name}
                onChange={handleAddChange}
                required
              />
            </Modal>
          )}
        </div>
        {/*kanan*/}
        <div className="flex items-center justify-end w-full md:w-1/2">
          <div className="w-full max-w-md sm:-translate-y-10 sm:translate-x-6 space-y-4">
            <FormPage
              id={id}
              depth={depth || 0}
              parentId={parentId || ""}
              nameMenu={nameMenu}
              handleChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
