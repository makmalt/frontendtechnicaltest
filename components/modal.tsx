"use client";

import { ReactNode, FormEvent } from "react";
import { Button } from "@/components/ui/button";

type ModalProps = {
  title?: string,
  setOpenModal: (open: boolean) => void,
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void,
  loading?: boolean,
  children?: ReactNode,
  tombol?: string,
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link",
};

export default function Modal({
  title = "Modal Title",
  setOpenModal,
  handleSubmit,
  loading = false,
  children,
  tombol = "Save",
  variant = "default",
}: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
      onClick={() => setOpenModal(false)}
    >
      {/* Modal box */}
      <div
        className="bg-white rounded-2xl shadow-lg w-11/12 sm:w-96 p-6 relative transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol close */}
        <button
          onClick={() => setOpenModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* Judul */}
        {title === "Delete Menu" ? (
          <h3 className="font-medium text-lg mb-4 text-red-500">{title}</h3>
        ) : (
          <h3 className="font-medium text-lg mb-4">{title}</h3>
        )}

        {/* Form */}
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          {children}

          {loading ? (
            <span>Loading...</span>
          ) : (
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant={variant}>
                {tombol}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
