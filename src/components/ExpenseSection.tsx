import { useMemo, useState, type KeyboardEvent } from "react";
import dayjs from "dayjs";
import type { Expense, UserName } from "../types/domain";
import { ExpenseList } from "./ExpenseList";

interface ExpenseSectionProps {
  users: UserName[];
  expenses: Expense[];
  onAddExpense: (payer: string, amount: string, desc: string) => boolean;
}

export function ExpenseSection({
  users,
  expenses,
  onAddExpense,
}: ExpenseSectionProps) {
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  const isAddExpenseDisabled = !payer || !amount || Number(amount) <= 0;

  const handleAddExpense = () => {
    const wasAdded = onAddExpense(payer, amount, desc);
    if (wasAdded) {
      setAmount("");
      setDesc("");
      setPayer("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isAddExpenseDisabled) {
      handleAddExpense();
    }
  };

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      return dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf();
    });
  }, [expenses]);

  return (
    <section className="section section-expenses">
      <div className="section-head">
        <h2>2. Registrar Gasto</h2>
        <p>Carga cada consumo para mantener el balance al día.</p>
      </div>

      <div className="expense-input-row">
        <select
          value={payer}
          onChange={(e) => setPayer(e.target.value)}
          aria-label="Quién pagó"
        >
          <option value="" disabled>
            ¿Quién pagó?
          </option>
          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Monto"
          aria-label="Monto"
        />
        <input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Concepto"
          aria-label="Concepto del gasto"
        />
      </div>

      <button
        type="button"
        className="primary-button"
        onClick={handleAddExpense}
        disabled={isAddExpenseDisabled}
      >
        Agregar gasto
      </button>

      <div className="list-block">
        <h3>Historial reciente</h3>
        {sortedExpenses.length === 0 ? (
          <p className="empty-copy">Aun no hay gastos registrados.</p>
        ) : (
          <ul className="expense-history">
            {sortedExpenses.map((expense) => (
              <ExpenseList key={expense.id} expense={expense} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
