import { useState, type KeyboardEvent } from "react";
import type { UserName } from "../types/domain";

interface UsersSectionProps {
  users: UserName[];
  onAddUser: (name: string) => boolean;
}

export function UsersSection({ users, onAddUser }: UsersSectionProps) {
  const [inputName, setInputName] = useState("");
  const isAddUserDisabled = inputName.trim() === "";

  const handleAddUser = () => {
    const wasAdded = onAddUser(inputName);
    if (wasAdded) {
      setInputName("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isAddUserDisabled) {
      handleAddUser();
    }
  };

  return (
    <div className="section">
      <h2>1. Participantes</h2>
      <input
        type="text"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Nombre (ej. Ana)"
        aria-label="Nombre de participante"
      />
      <button onClick={handleAddUser} disabled={isAddUserDisabled}>
        Agregar Persona
      </button>
      <ul>
        {users.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </div>
  );
}
