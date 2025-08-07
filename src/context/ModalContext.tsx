import { createContext, useContext, useState, type ReactNode } from "react";

type ModalContextType = {
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const showModal = (content: ReactNode) => setModalContent(content);
  const hideModal = () => setModalContent(null);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalContent && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/40 flex items-center justify-center z-50">
          <div className="bg-gray-100 rounded-2xl p-4 shadow-xl min-w-[300px]">
            {modalContent}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}
