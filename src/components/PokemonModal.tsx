import React, { useCallback } from "react";

interface IModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const PokemonModal: React.FC<IModalProps> = ({ isOpen, setIsOpen }) => {
  const handleCloseModal = useCallback((e: any) => {
    if ((e.target as any).id === "body") {
      setIsOpen(false);
    }
  }, []);

  return (
    <>
      {isOpen && (
        <div
          onClick={handleCloseModal}
          id="body"
          className="fixed h-screen w-full bg-black bg-opacity-60 transition-all flex justify-center items-center z-20"
        >
          <div className="bg-zinc-300 w-[300px] h-[300px] rounded-md">
            <header>
              <h2>Modal</h2>

              <button onClick={() => setIsOpen(false)}>Close</button>
            </header>
          </div>
        </div>
      )}
    </>
  );
};

export { PokemonModal };
