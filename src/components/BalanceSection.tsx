import { useEffect, useState } from "react";
import { calculator } from "../utils/calculator";
import { TransactionList } from "./TransactionList";
import type { Transaction, UserName, Expense } from "../types/domain";

interface BalanceSectionProps {
  users: UserName[];
  expenses: Expense[];
  onClearData: () => void;
}

export function BalanceSection({
  users,
  expenses,
  onClearData,
}: BalanceSectionProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showAccumulated, setShowAccumulated] = useState(false);

  const calculateSplit = () => {
    const result = calculator.calculateSplit(users, expenses);
    setTransactions(result.transactions);
    setHasCalculated(true);
  };

  const toggleAccumulated = () => {
    setShowAccumulated((prev) => !prev);
  };

  const getAccumulatedExpenses = () =>
    calculator.calculateBalances(users, expenses);

  const isCalculateDisabled = users.length === 0 || expenses.length === 0;

  useEffect(() => {
    setTransactions([]);
    setHasCalculated(false);
  }, [users, expenses]);

  return (
    <div className="section">
      <h2>3. Balance Final</h2>

      {users.length > 0 && expenses.length > 0 && (
        <div className="accumulated-section">
          <div className="accumulated-header">
            <h3>Acumulado por Participante</h3>
            <button onClick={toggleAccumulated} className="secondary-button">
              {showAccumulated ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {showAccumulated && (
            <div className="accumulated-list">
              {Object.entries(getAccumulatedExpenses())
                .sort(([, a], [, b]) => b - a)
                .map(([user, amount]) => (
                  <div key={user} className="accumulated-item">
                    <span className="user-name">{user}</span>
                    <span className="amount">${amount.toFixed(2)}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      <div className="action-buttons">
        <button
          onClick={calculateSplit}
          className="primary-button"
          disabled={isCalculateDisabled}
        >
          Calcular Deudas
        </button>
        <button onClick={onClearData} className="danger-button">
          Limpiar Datos
        </button>
      </div>
      <div className="results">
        {expenses.length === 0 ? (
          <p>No hay gastos registrados.</p>
        ) : !hasCalculated ? (
          <p>Hay cambios sin recalcular. Haz clic en "Calcular Deudas".</p>
        ) : transactions.length === 0 ? (
          <p>Las cuentas están saldadas.</p>
        ) : (
          <ul>
            {transactions.map((transaction, index) => (
              <TransactionList
                key={`${transaction.from}-${transaction.to}-${transaction.amount}-${index}`}
                transaction={transaction}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
