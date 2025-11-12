"use client";

import { useActiveStore } from "@/stores/activeStore";
import { useShallow } from "zustand/shallow";
import { Folder } from "lucide-react";

export default function ClientLayout({ children }) {
  const { nameActive } = useActiveStore(
    useShallow((state) => ({
      nameActive: state.nameActive  ,
    }))
  );
  return (
    <>
      <div className="text-sm ms-6 flex gap-1 text-gray-600"><Folder size={20}/>/ {nameActive}</div>
      {children}
    </>
  );
}
