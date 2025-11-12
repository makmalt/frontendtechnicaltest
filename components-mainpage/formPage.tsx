"use client";

import { useShallow } from "zustand/shallow";
import Form from "../components/form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { updateMenu } from "@/lib/api";
import { useMenuStore } from "@/stores/menuStore";
import { FormEvent } from "react";

type FormPageProps = {
  id?: string,
  depth?: number,
  parentId?: string | null,
  nameMenu?: string,
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
};

export default function FormPage({
  id = "",
  depth = 1,
  parentId = null,
  nameMenu = "",
  handleChange,
}: FormPageProps) {
  const { fetchMenu } = useMenuStore(
    useShallow((state) => ({
      fetchMenu: state.fetchMenu,
    }))
  );

  const handleUpdateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Updated Menu Data:", {
      id,
      depth,
      parentId,
      name: nameMenu,
    });

    try {
      await updateMenu(id, {
        id,
        depth,
        parentId: parentId || null,
        name: nameMenu,
      });
      await fetchMenu();
    } catch (error) {
      console.error("Error updating menu:", error);
      alert("Failed to update menu.");
    }
  };

  return (
    <>
      <Form handleSubmit={handleUpdateSubmit}>
        <label htmlFor="MenuID">Menu ID</label>
        <Input name="id" type="text" value={id ?? ""} disabled />

        <label htmlFor="depth">Depth</label>
        <Input name="depth" type="number" value={depth ?? 0} disabled />

        <label htmlFor="parentId">Parent ID</label>
        <Input
          className="disabled"
          name="parentId"
          type="text"
          value={parentId ?? ""}
          disabled
        />

        <label htmlFor="nameMenu">Name</label>
        <Input
          name="nameMenu"
          type="text"
          value={nameMenu ?? ""}
          onChange={handleChange}
        />

        <Button
          variant={null}
          type="submit"
          className="border mt-4 bg-[#0C49B0] text-white hover:bg-blue-900 rounded-full cursor-pointer"
        >
          Update Menu
        </Button>
      </Form>
    </>
  );
}
