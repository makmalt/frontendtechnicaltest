import { ChevronDown, ChevronRight, Trash2, Plus } from "lucide-react";
import { useFormStore } from "@/stores/activeStore";
import { useShallow } from "zustand/shallow";
import { useState } from "react";
import { useAddMenuStore } from "@/stores/addMenuStore";
import Modal from "@/components/modal";
import { Input } from "@/components/ui/input";
import { createMenu, deleteMenu } from "@/lib/api";
import { useMenuStore, MenuItem } from "@/stores/menuStore";

export default function MenuNode({
  node,
  level,
  expandedNodes,
  setExpandedNodes,
}: {
  node: MenuItem;
  level: number;
  expandedNodes: Set<string>;
  setExpandedNodes: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const expanded = expandedNodes.has(node.id);
  const [loadingModal, setLoadingModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { fetchMenu } = useMenuStore(
    useShallow((state) => ({
      fetchMenu: state.fetchMenu,
    }))
  );
  const { setAddMenu, name, depth, parentId, handleAddChange, reset } =
    useAddMenuStore(
      useShallow((state) => ({
        setAddMenu: state.setAddMenu,
        name: state.name,
        depth: state.depth,
        parentId: state.parentId,
        handleAddChange: state.handleAddChange,

        reset: state.reset,
      }))
    );
  const { setForm, activeNodeId } = useFormStore(
    useShallow((state) => ({
      setForm: state.setForm,
      activeNodeId: state.activeNodeId,
    }))
  );
  //cek node yang aktif
  const isActiveNode = activeNodeId === node.id;

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
      activeNodeId: node.id,
    });
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAddMenu({ depth: node.depth + 1, parentId: node.id });
    setOpenModal(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModal(true);
  };

  const handleDeleteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingModal(true);
    try {
      await deleteMenu(node.id).then(() => {
        fetchMenu();
        setLoadingModal(false);
        setDeleteModal(false);
      });
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoadingModal(true);
    try {
      const newMenu = {
        id: crypto.randomUUID(),
        depth: depth,
        parentId: parentId,
        name: name,
        iconType: depth > 3 ? "MENU" : "FOLDER",
        isVisible: depth > 2 ? true : false,
      };
      await createMenu(newMenu).then(() => {
        fetchMenu();
        setLoadingModal(false);
        setOpenModal(false);
        reset();
      });
    } catch (error) {
      console.error("Error creating menu:", error);
    }

    setOpenModal(false);
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className="relative flex items-center gap-2 py-1.5 cursor-pointer rounded-md hover:bg-gray-100 transition"
        style={{ paddingLeft: `${level * 20}px` }}
      >
        {level > 0 && (
          <span
            className="absolute bg-gray-500 h-px"
            style={{
              width: "16px",
              left: `${level * 20 - 16}px`,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        )}

        {hasChildren ? (
          expanded ? (
            <ChevronDown
              className="w-4 h-4 text-gray-600 shrink-0"
              onClick={handleToggle}
            />
          ) : (
            <ChevronRight
              className="w-4 h-4 text-gray-600 shrink-0"
              onClick={handleToggle}
            />
          )
        ) : (
          <div className="w-4" />
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{node.name}</span>
          {isActiveNode && (
            <div className="flex gap-2">
              <span
                onClick={handleAddClick}
                className="rounded-full p-1 bg-sidebar hover:bg-blue-900"
              >
                <Plus color="white" size={15} />
              </span>
              <span
                onClick={handleDeleteClick}
                className="rounded-full p-1 bg-red-500 hover:bg-red-700"
              >
                <Trash2 color="white" size={15} />
              </span>
            </div>
          )}
        </div>
      </div>
      {hasChildren && expanded && (
        <div className="relative ml-5">
          <div
            className="absolute left-0 border-l-2 border-gray-300"
            style={{
              top: "0",
              bottom: "8px",
            }}
          />
          <div className="pl-4 space-y-1">
            {node.children?.map((child: MenuItem) => (
              <MenuNode
                key={child.id}
                node={child}
                level={level + 1}
                expandedNodes={expandedNodes}
                setExpandedNodes={setExpandedNodes}
              />
            ))}
          </div>
        </div>
      )}
      {openModal && (
        <Modal
          title="Add New Menu"
          setOpenModal={() => {
            setOpenModal(false);
            reset();
          }}
          tombol={"Save"}
          handleSubmit={handleAddSubmit}
          loading={loadingModal}
          variant={"default"}
        >
          <label htmlFor="parentId">Parent ID</label>
          <Input type="text" name="parentId" value={parentId || ""} disabled />
          <label htmlFor="depth">Depth</label>
          <Input type="number" name="depth" value={depth || 0} disabled />
          <label htmlFor="name">Menu Name</label>
          <Input
            type="text"
            name="name"
            value={name}
            onChange={handleAddChange}
          />
        </Modal>
      )}
      {/* modal delete*/}
      {deleteModal && (
        <Modal
          title="Delete Menu"
          setOpenModal={() => setDeleteModal(false)}
          loading={loadingModal}
          tombol={"Delete"}
          variant={"destructive"}
          handleSubmit={handleDeleteSubmit}
        >
          <p>Are you sure you want to delete the menu`{node.name}`?</p>
        </Modal>
      )}
    </div>
  );
}
