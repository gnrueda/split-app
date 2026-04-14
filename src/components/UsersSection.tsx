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
    <section className="section section-users">
      <div className="section-head">
        <h2>1. Participantes</h2>
        <p>Añade quienes forman parte del gasto compartido.</p>
      </div>

      <div className="field-row">
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Nombre"
          aria-label="Nombre de participante"
        />
        <button
          type="button"
          className="primary-button"
          onClick={handleAddUser}
          disabled={isAddUserDisabled}
        >
          Agregar persona
        </button>
      </div>

      {users.length === 0 ? (
        <p className="empty-copy">Aun no hay participantes registrados.</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user} className="user-pill">
              {user}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
