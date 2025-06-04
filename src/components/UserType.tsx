import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (role: "doctor" | "patient") => void;
}

const UserTypeModal: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Continue as:</h2>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onSelect("doctor")}
            className="p-4 border border-blue-600 rounded-md hover:bg-blue-50"
          >
            👨‍⚕️ I'm a Doctor
          </button>
          <button
            onClick={() => onSelect("patient")}
            className="p-4 border border-green-600 rounded-md hover:bg-green-50"
          >
            🧑‍🦱 I'm a Patient
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline text-center block mx-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserTypeModal;
