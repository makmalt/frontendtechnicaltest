"use client";
import { Button } from "@/components/ui/button";

const Modal = ({
  title,
  setOpenModal,
  handleSubmit,
  loading,
  children,
  tombol,
  variant,
}) => {
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

        <h3 className="font-bold text-lg mb-4">{title}</h3>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {children}
          {loading ? (
            <span>Loading...</span>
          ) : (
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant={variant || "default"}>
                {tombol}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Modal;
